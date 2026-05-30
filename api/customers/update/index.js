import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

const resolveNotificationPreferenceValue = ({ preference, email, phone }) => {
  if (typeof preference === 'undefined') return undefined;

  const raw = String(preference || '').trim();
  if (!raw) return '';

  const lower = raw.toLowerCase();
  if (lower === 'email') return normalizeEmail(email);
  if (lower === 'sms' || lower === 'phone') return normalizePhone(phone);
  if (lower === 'email/sms') return normalizeEmail(email) || normalizePhone(phone);

  // Already an actual contact value
  if (raw.includes('@')) return normalizeEmail(raw);
  return normalizePhone(raw) || raw;
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, name, email, phone, histories } = req.body;
  const { notificationPreference } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!normalizedEmail && !normalizedPhone) {
    return res.status(400).json({ error: 'At least one valid email or phone number is required' });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });

    const { data: currentCustomer, error: currentError } = await supabase
      .from('customers_accounts')
      .select('id, email, phone, notif_pref')
      .eq('id', customerId)
      .maybeSingle();

    if (currentError) {
      return res.status(500).json({ error: 'Failed to load customer', details: currentError.message });
    }

    if (!currentCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (normalizedEmail && normalizedEmail !== normalizeEmail(currentCustomer.email)) {
      const { data: emailConflict, error: emailError } = await supabase
        .from('customers_accounts')
        .select('id')
        .eq('email', normalizedEmail)
        .neq('id', customerId)
        .maybeSingle();

      if (emailError) {
        return res.status(500).json({ error: 'Failed to validate email uniqueness', details: emailError.message });
      }

      if (emailConflict) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    if (normalizedPhone && normalizedPhone !== normalizePhone(currentCustomer.phone)) {
      const { data: phoneConflict, error: phoneError } = await supabase
        .from('customers_accounts')
        .select('id')
        .eq('phone', normalizedPhone)
        .neq('id', customerId)
        .maybeSingle();

      if (phoneError) {
        return res.status(500).json({ error: 'Failed to validate phone uniqueness', details: phoneError.message });
      }

      if (phoneConflict) {
        return res.status(409).json({ error: 'Phone number already in use' });
      }
    }

    const resolvedNotificationPreference = resolveNotificationPreferenceValue({
      preference: notificationPreference,
      email: normalizedEmail || currentCustomer.email,
      phone: normalizedPhone || currentCustomer.phone,
    });

    if (typeof notificationPreference !== 'undefined' && !resolvedNotificationPreference) {
      return res.status(400).json({ error: 'Selected notification preference requires a valid contact value' });
    }

    const updateData = {
      name: String(name).trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      ...(histories ? { histories } : {}),
      ...(typeof notificationPreference !== 'undefined' ? { notif_pref: resolvedNotificationPreference } : {}),
    };

    const { data, error } = await supabase
      .from('customers_accounts')
      .update(updateData)
      .eq('id', customerId)
      .select('id, name, email, phone, histories, notif_pref')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update customer profile', details: error.message });
    }

    return res.status(200).json({
      success: true,
      customer: data,
    });
  } catch (error) {
    console.error('[CustomerUpdate] Error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};