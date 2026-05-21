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

    const hashedPassword = await bcrypt.hash(password, 12);

    // Set histories to null if not provided
    const insertData = {
      name,
      password: hashedPassword,
      ...(normalizedEmail && { email: normalizedEmail }),
      ...(normalizedPhone && { phone: normalizedPhone }),
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

    // Attempt to remove any lingering OTP records for this contact to keep table clean
    try {
      if (normalizedEmail) {
        await deleteOtpByEmail(normalizedEmail);
      }
      if (normalizedPhone) {
        await deleteOtpByPhone(normalizedPhone);
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
