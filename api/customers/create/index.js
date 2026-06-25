import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { deleteOtpByEmail, deleteOtpByPhone } from '../../supabaseOtpClient.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');
const normalizePhone = (value) => (typeof value === 'string' ? value.replace(/\D/g, '') : '');

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, password, histories } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    if (!name || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, password' });
    }

    if (!normalizedEmail && !normalizedPhone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    // Phone validation: exactly 11 digits and must start with 09
    if (normalizedPhone) {
      if (normalizedPhone.length !== 11) {
        return res.status(400).json({
          error: 'Invalid phone number',
          details: 'Phone Number must be 11 digits'
        });
      }

      if (!normalizedPhone.startsWith('09')) {
        return res.status(400).json({
          error: 'Invalid phone number',
          details: 'Phone Number starts with 09'
        });
      }
    }


    // Email validation: only allow gmail.com addresses

    if (normalizedEmail) {
      // Require exact domain match (case-insensitive via normalizeEmail)
      const domain = normalizedEmail.split('@')[1] || '';
      if (domain !== 'gmail.com') {
        return res.status(400).json({
          error: 'Invalid email',
          details: 'Only @gmail.com emails are allowed.'
        });
      }
    }


    // CHECK FOR VERIFIED OTP BEFORE ALLOWING ACCOUNT CREATION
    console.log('[Customers:Create] Checking for verified OTP...');
    
    let otpRecord = null;
    if (normalizedEmail) {
      const { data: emailOtps, error: emailError } = await supabase
        .from('customer_otps')
        .select('id, email, phone, verified')
        .eq('email', normalizedEmail)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (emailError) {
        console.error('[Customers:Create] Error querying email OTP:', emailError);
      }
      
      if (emailOtps && emailOtps.length > 0) {
        otpRecord = emailOtps[0];
        console.log('[Customers:Create] Found verified OTP via email');
      }
    }

    if (!otpRecord && normalizedPhone) {
      let formattedPhone = normalizedPhone;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+63' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+63' + formattedPhone;
        }
      }

      const { data: phoneOtps, error: phoneError } = await supabase
        .from('customer_otps')
        .select('id, email, phone, verified')
        .eq('phone', formattedPhone)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (phoneError) {
        console.error('[Customers:Create] Error querying phone OTP:', phoneError);
      }
      
      if (phoneOtps && phoneOtps.length > 0) {
        otpRecord = phoneOtps[0];
        console.log('[Customers:Create] Found verified OTP via phone');
      }
    }

    // OTP MUST be verified before account creation
    if (!otpRecord) {
      console.warn('[Customers:Create] No verified OTP found for:', { email: normalizedEmail, phone: normalizedPhone });
      return res.status(403).json({
        error: 'Email/Phone verification required',
        details: 'Please verify your email or phone with the OTP sent to you before creating an account.'
      });
    }

    console.log('[Customers:Create] OTP verified, proceeding with account creation');

    const emailCheck = normalizedEmail
      ? await supabase.from('customers_accounts').select('id, name, email, phone').eq('email', normalizedEmail).limit(1)
      : { data: null, error: null };
    const phoneCheck = normalizedPhone
      ? await supabase.from('customers_accounts').select('id, name, email, phone').eq('phone', normalizedPhone).limit(1)
      : { data: null, error: null };

    if (emailCheck.error) {
      console.error('[Customers:Create] Email duplicate lookup error:', emailCheck.error);
      return res.status(500).json({ error: 'Failed to validate account uniqueness', details: emailCheck.error.message });
    }

    if (phoneCheck.error) {
      console.error('[Customers:Create] Phone duplicate lookup error:', phoneCheck.error);
      return res.status(500).json({ error: 'Failed to validate account uniqueness', details: phoneCheck.error.message });
    }

    const duplicateCustomer = (emailCheck.data && emailCheck.data[0]) || (phoneCheck.data && phoneCheck.data[0]);

    if (duplicateCustomer) {
      return res.status(409).json({
        error: 'Account already exists',
        details: 'A customer account already exists with that email or phone number',
        existing: {
          id: duplicateCustomer.id,
          name: duplicateCustomer.name,
          email: duplicateCustomer.email,
          phone: duplicateCustomer.phone,
        }
      });
    }

    // Disallow spaces in password (prevents accidental whitespace)
    if (typeof password !== 'string' || /\s/.test(password)) {
      return res.status(400).json({
        error: 'Invalid password',
        details: 'Password must not contain spaces.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);


    // Set histories to null if not provided
    const insertData = {
      name,
      password: hashedPassword,
      ...(normalizedEmail && { email: normalizedEmail }),
      ...(normalizedPhone && { phone: normalizedPhone }),
      // notif_pref should default to the contact used at registration (email preferred)
      notif_pref: normalizedEmail || normalizedPhone,
      histories: histories || null,
    };

    const { data, error } = await supabase
      .from('customers_accounts')
      .insert([insertData])
      .select();

    if (error) {
      console.error('[Customers:Create] Error:', error);
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'Account already exists',
          details: 'A customer account already exists with that email or phone number'
        });
      }
      return res.status(400).json({ error: 'Failed to create account', details: error.message });
    }

    // Account created successfully - delete the verified OTP record to clean up
    try {
      const { error: deleteError } = await supabase
        .from('customer_otps')
        .delete()
        .eq('id', otpRecord.id);
      
      if (deleteError) {
        console.warn('[Customers:Create] Failed to delete used OTP:', deleteError.message);
        // Don't fail account creation if OTP cleanup fails
      } else {
        console.log('[Customers:Create] Cleaned up used OTP');
      }
    } catch (deleteErr) {
      console.error('[Customers:Create] Failed to delete OTP after create:', deleteErr.message || deleteErr);
      // Do not fail the registration if OTP cleanup fails
    }

    return res.status(201).json({
      success: true,
      data: {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
      }
    });
  } catch (err) {
    console.error('[Customers:Create] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
