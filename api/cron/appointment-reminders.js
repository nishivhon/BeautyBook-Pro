import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

const UNISMS_API_URL = 'https://unismsapi.com/api/sms';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = 'BeautyBook';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
};

const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');
const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const isEmailContact = (value) => normalizeEmail(value).includes('@');

const formatPhoneForSms = (value) => {
  const normalized = normalizePhone(value);
  if (!normalized) return '';

  if (normalized.startsWith('63')) return `+${normalized}`;
  if (normalized.startsWith('0')) return `+63${normalized.slice(1)}`;
  return `+63${normalized}`;
};

const getManilaNow = () => {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const year = dateParts.find((part) => part.type === 'year')?.value;
  const month = dateParts.find((part) => part.type === 'month')?.value;
  const day = dateParts.find((part) => part.type === 'day')?.value;

  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());

  const hour = Number(timeParts.find((part) => part.type === 'hour')?.value || 0);
  const minute = Number(timeParts.find((part) => part.type === 'minute')?.value || 0);

  return {
    date: `${year}-${month}-${day}`,
    minutesOfDay: (hour * 60) + minute,
  };
};

const DRY_RUN = String(process.env.REMINDERS_DRY_RUN || '').trim() === '1';

const parseTimeToMinutes = (timeValue) => {
  if (!timeValue) return null;

  // Accept strings like "10:30", "10:30 AM", "10:30:00", or ISO datetimes
  try {
    const asString = String(timeValue).trim();

    // 1) Try common HH:MM or HH:MM AM/PM formats
    const normalized = asString.toUpperCase();
    const match = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/);
    if (match) {
      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const meridiem = match[4] || null;

      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
      if (minutes < 0 || minutes > 59) return null;

      if (meridiem) {
        if (hours < 1 || hours > 12) return null;
        if (meridiem === 'AM') {
          hours = hours === 12 ? 0 : hours;
        } else if (meridiem === 'PM') {
          hours = hours === 12 ? 12 : hours + 12;
        }
      } else if (hours < 0 || hours > 23) {
        return null;
      }

      return (hours * 60) + minutes;
    }

    // 2) Try parseable date/time strings (ISO etc.). Convert to Asia/Manila time parts
    const parsed = Date.parse(asString);
    if (!Number.isNaN(parsed)) {
      const d = new Date(parsed);
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(d).reduce((acc, p) => { if (p.type !== 'literal') acc[p.type] = p.value; return acc; }, {});

      const h = Number(parts.hour || 0);
      const m = Number(parts.minute || 0);
      if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
      return (h * 60) + m;
    }
  } catch (err) {
    // Fall through to null
  }

  return null;
};

const formatAppointmentTime = (timeValue) => {
  const minutes = parseTimeToMinutes(timeValue);
  if (minutes === null) {
    return String(timeValue || '').trim() || 'your scheduled time';
  }

  const hours24 = Math.floor(minutes / 60);
  const minuteValue = minutes % 60;
  const isPm = hours24 >= 12;
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minuteValue).padStart(2, '0')} ${isPm ? 'PM' : 'AM'}`;
};

const parseServicesSummary = (servicesValue) => {
  if (!servicesValue) return 'your service';

  let services = servicesValue;
  if (typeof servicesValue === 'string') {
    try {
      services = JSON.parse(servicesValue);
    } catch {
      return 'your service';
    }
  }

  const entries = Array.isArray(services) ? services : [services];
  const formatted = entries
    .map((item) => {
      if (!item) return null;
      if (typeof item === 'string') return item.trim();

      const category = String(item.category || item.category_name || 'General').trim() || 'General';
      const name = String(item.name || item.title || item.service || '').trim();
      return name ? `${category}: ${name}` : null;
    })
    .filter(Boolean);

  return formatted.length > 0 ? formatted.join(' • ') : 'your service';
};

const buildReminderText = ({ name, appointmentTime, serviceSummary, staffName }) =>
  `Hello ${name}, this is your BeautyBook reminder for your appointment at ${appointmentTime} with ${staffName || 'our staff'}. Service: ${serviceSummary}.`;

const sendSmsAsync = async (phone, name, appointmentTime, serviceSummary, staffName) => {
  if (!process.env.UNISMS_API_KEY) {
    throw new Error('UNISMS_API_KEY is not configured');
  }

  const message = buildReminderText({ name, appointmentTime, serviceSummary, staffName });
  const payload = {
    recipient: phone,
    content: message,
  };

  const base64Auth = Buffer.from(`${process.env.UNISMS_API_KEY}:`).toString('base64');
  const response = await fetch(UNISMS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SMS request failed with HTTP ${response.status}: ${errorText}`);
  }

  const body = await response.json().catch(() => ({}));

  console.log('[AppointmentReminders] SMS sent successfully:', {
    to: phone,
    status: response.status,
    providerResponse: body,
  });

  return { ok: true, httpStatus: response.status, providerResponse: body };
};

const sendEmailAsync = async (email, name, appointmentTime, serviceSummary, staffName) => {
  if (!BREVO_API_KEY || !BREVO_SENDER_EMAIL) {
    throw new Error('Email service is not configured');
  }

  const message = buildReminderText({ name, appointmentTime, serviceSummary, staffName });

  const emailBody = {
    sender: {
      name: BREVO_SENDER_NAME,
      email: BREVO_SENDER_EMAIL,
    },
    to: [
      {
        email,
        name,
      },
    ],
    subject: 'Appointment Reminder - BeautyBook',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h2 style="color: #dd901d;">Your appointment is coming up</h2>
        <p>Hi ${name},</p>
        <p>${message}</p>
        <p>Please arrive a few minutes early if possible.</p>
        <p style="font-size: 12px; color: #777; margin-top: 24px;">This is an automated reminder from BeautyBook.</p>
      </div>
    `,
    textContent: `${message} Please arrive a few minutes early if possible.`,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email request failed with HTTP ${response.status}: ${errorText}`);
  }

  const body = await response.json().catch(() => ({}));

  console.log('[AppointmentReminders] Email sent successfully:', {
    to: email,
    status: response.status,
    providerResponse: body,
  });

  return { ok: true, httpStatus: response.status, providerResponse: body };
};

export default async (req, res) => {
  // Helpful for Vercel cron debugging
  console.log('[AppointmentReminders] request:', {
    method: req.method,
    url: req?.url,
    headers: { 'x-vercel-id': req?.headers?.['x-vercel-id'] },
    env: {
      DRY_RUN,
      BREVO_API_KEY_SET: !!BREVO_API_KEY,
      BREVO_SENDER_EMAIL_SET: !!BREVO_SENDER_EMAIL,
      UNISMS_API_KEY_SET: !!process.env.UNISMS_API_KEY,
    }
  });

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getSupabaseClient();
    const manilaNow = getManilaNow();
    const reminderTargetMinutes = manilaNow.minutesOfDay + 15;

  console.log('[AppointmentReminders] manilaNow:', manilaNow, 'reminderTargetMinutes:', reminderTargetMinutes, 'DRY_RUN:', DRY_RUN);

    const runAt = new Date().toISOString();
    console.log('[AppointmentReminders] runAtISO:', runAt);

    const { data: slots, error } = await supabase
    .from('available_slots')
    .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status, availability, reminder_sent, reminder_sent_at')
    .eq('date', manilaNow.date)
    // Send based on status only (availability may be true/false depending on how booking sets the row)
    .in('status', ['pending', 'current'])
    .eq('reminder_sent', false);

    if (error) {
      throw error;
    }

    const candidates = (slots || []).filter((slot) => {
      const rawTime = slot.time_slot || '';
      const slotMinutes = parseTimeToMinutes(String(rawTime));
      if (slotMinutes === null) {
        console.log('[AppointmentReminders] Could not parse time for slot', slot.id, 'raw:', rawTime);
        return false;
      }
      // allow tolerance window in case scheduler timing/server clock differs
      return Math.abs(slotMinutes - reminderTargetMinutes) <= 10;
    });

    console.log('[AppointmentReminders] fetched slots:', (slots || []).length, 'candidates after filter:', candidates.length);

    // Minimal time debug for local testing:
    // show only the upcoming 15-min window and whether each slot falls inside it.
    // (No large per-slot diff logs.)
    if (slots && slots.length > 0) {
      const windowStart = reminderTargetMinutes - 10;
      const windowEnd = reminderTargetMinutes + 10;
      const within = candidates.map((slot) => ({
        id: slot.id,
        time_slot: slot.time_slot,
        channel: isEmailContact(String(slot.customer_contact || '').trim()) ? 'email' : 'sms',
      }));

      console.log('[AppointmentReminders][Window] nowMinutes:', manilaNow.minutesOfDay, {
        reminderTargetMinutes,
        toleranceWindowMinutes: 10,
        windowStart,
        windowEnd,
        withinCount: within.length,
        within,
      });
    }

    const sent = [];
    const skipped = [];

    for (const slot of candidates) {
      const contact = String(slot.customer_contact || '').trim();
      if (!contact) {
        skipped.push({ id: slot.id, reason: 'missing_contact' });
        continue;
      }

      const appointmentTime = formatAppointmentTime(slot.time_slot);
      const serviceSummary = parseServicesSummary(slot.services);
      const reminderText = buildReminderText({
        name: slot.customer_name || 'Customer',
        appointmentTime,
        serviceSummary,
        staffName: slot.assigned_staff,
      });

      try {
        if (DRY_RUN) {
          // In dry-run mode, just record what would be sent
          console.log('[AppointmentReminders] DRY_RUN candidate:', {
            slotId: slot.id,
            contact,
            channel: isEmailContact(contact) ? 'email' : 'sms',
            to: isEmailContact(contact) ? normalizeEmail(contact) : formatPhoneForSms(contact),
            preview: reminderText,
          });

          sent.push({
            id: slot.id,
            customer: slot.customer_name,
            time_slot: slot.time_slot,
            channel: isEmailContact(contact) ? 'email' : 'sms',
            preview: reminderText,
            dryRun: true,
          });
          console.log('[AppointmentReminders] DRY_RUN - would send to', contact, 'preview:', reminderText);
        } else {
          if (isEmailContact(contact)) {
            const normalizedEmail = normalizeEmail(contact);
            const emailResult = await sendEmailAsync(
              normalizedEmail,
              slot.customer_name || 'Customer',
              appointmentTime,
              serviceSummary,
              slot.assigned_staff
            );

            const { error: updateError } = await supabase
              .from('available_slots')
              .update({
                reminder_sent: true,
                reminder_sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', slot.id);

            if (updateError) {
              throw updateError;
            }

            sent.push({
              id: slot.id,
              customer: slot.customer_name,
              time_slot: slot.time_slot,
              channel: 'email',
              to: normalizedEmail,
              provider: 'brevo',
              providerHttpStatus: emailResult?.httpStatus,
              preview: reminderText,
            });
          } else {
            const phone = formatPhoneForSms(contact);
            if (!phone) {
              skipped.push({ id: slot.id, reason: 'invalid_phone' });
              continue;
            }

            const smsResult = await sendSmsAsync(
              phone,
              slot.customer_name || 'Customer',
              appointmentTime,
              serviceSummary,
              slot.assigned_staff
            );

            const { error: updateError } = await supabase
              .from('available_slots')
              .update({
                reminder_sent: true,
                reminder_sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', slot.id);

            if (updateError) {
              throw updateError;
            }

            sent.push({
              id: slot.id,
              customer: slot.customer_name,
              time_slot: slot.time_slot,
              channel: 'sms',
              to: phone,
              provider: 'unisms',
              providerHttpStatus: smsResult?.httpStatus,
              preview: reminderText,
            });
          }
        }
      } catch (sendError) {
        skipped.push({
          id: slot.id,
          reason: isEmailContact(contact) ? 'email_send_failed' : 'sms_send_failed',
          details: String(sendError?.message || sendError),
        });
        continue;
      }
    }

    return res.status(200).json({
      success: true,
      date: manilaNow.date,
      checkedAtMinutes: manilaNow.minutesOfDay,
      targetMinutes: reminderTargetMinutes,
      candidateCount: candidates.length,
      sentCount: sent.length,
      skippedCount: skipped.length,
      sent,
      skipped,
    });
  } catch (error) {
    console.error('[AppointmentReminders] Error:', error.message || error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send appointment reminders',
      details: String(error.message || error)
    });
  }
};