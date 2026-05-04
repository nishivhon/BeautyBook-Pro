import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const getServiceNameFromSlot = (slot) => {
  if (!slot?.services) {
    return 'Service pending';
  }

  if (typeof slot.services === 'string') {
    return slot.services;
  }

  if (Array.isArray(slot.services)) {
    return slot.services
      .map((service) => service?.name || service?.title || service)
      .filter(Boolean)
      .join(', ') || 'Service pending';
  }

  if (typeof slot.services === 'object') {
    if (slot.services.name) {
      return slot.services.name;
    }

    return Object.values(slot.services).flat().filter(Boolean).join(', ') || 'Service pending';
  }

  return 'Service pending';
};

const normalizeHistories = (histories) => {
  if (!histories) {
    return [];
  }

  if (Array.isArray(histories)) {
    return histories;
  }

  if (typeof histories === 'string') {
    try {
      const parsed = JSON.parse(histories);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }

  return [histories];
};

const updateCustomerHistoryStatus = async (supabase, slot, status) => {
  console.log('[updateCustomerHistoryStatus] Called with slot:', { id: slot?.id, customer_contact: slot?.customer_contact, status });
  
  const customerContact = slot?.customer_contact;
  if (!customerContact || !['current', 'done'].includes(status)) {
    console.warn('[updateCustomerHistoryStatus] Invalid input - contact:', customerContact, 'status:', status);
    return { updated: false, reason: 'No customer contact or unsupported status' };
  }

  const contactValue = String(customerContact).trim();
  const isEmail = contactValue.includes('@');
  console.log('[updateCustomerHistoryStatus] Looking up customer by', isEmail ? 'email' : 'phone', ':', contactValue);
  
  const customerQuery = supabase
    .from('customers_accounts')
    .select('id, histories');

  const { data: customers, error: customerError } = isEmail
    ? await customerQuery.eq('email', contactValue).limit(1)
    : await customerQuery.eq('phone', contactValue).limit(1);

  console.log('[updateCustomerHistoryStatus] Customer lookup - error:', customerError, 'found:', customers?.length);

  if (customerError) {
    console.error('[updateCustomerHistoryStatus] Customer error:', customerError.message);
    return { updated: false, reason: customerError.message };
  }

  const customer = customers?.[0];
  if (!customer) {
    console.warn('[updateCustomerHistoryStatus] Customer not found with contact:', contactValue);
    return { updated: false, reason: 'Customer account not found' };
  }

  console.log('[updateCustomerHistoryStatus] Customer found:', { id: customer.id, histories_count: Array.isArray(customer.histories) ? customer.histories.length : 0 });

  const histories = normalizeHistories(customer.histories);
  if (histories.length === 0) {
    console.warn('[updateCustomerHistoryStatus] No histories in customer record');
    return { updated: false, reason: 'No history records found' };
  }

  const serviceName = getServiceNameFromSlot(slot);
  const targetDate = slot?.date;
  const targetStaff = slot?.assigned_staff;

  console.log('[updateCustomerHistoryStatus] Searching for matching history - service:', serviceName, 'date:', targetDate, 'staff:', targetStaff);

  let matchIndex = -1;
  for (let index = histories.length - 1; index >= 0; index -= 1) {
    const historyItem = histories[index] || {};
    const itemStatus = String(historyItem.status || '').toLowerCase();
    const isUpdatable = itemStatus === 'pending' || itemStatus === 'current';
    const dateMatches = !targetDate || String(historyItem.date || '').trim() === String(targetDate || '').trim();
    const staffMatches = !targetStaff || String(historyItem.staff || '').trim() === String(targetStaff || '').trim();
    const serviceText = String(historyItem.service || '').toLowerCase();
    const targetServiceText = String(serviceName || '').toLowerCase();
    const serviceMatches = !serviceName || serviceText === targetServiceText || serviceText.includes(targetServiceText) || targetServiceText.includes(serviceText);

    if (isUpdatable && dateMatches && staffMatches && serviceMatches) {
      console.log('[updateCustomerHistoryStatus] Found exact match at index:', index, 'with status:', itemStatus);
      matchIndex = index;
      break;
    }
  }

  if (matchIndex === -1) {
    console.log('[updateCustomerHistoryStatus] No exact match, falling back to last updatable entry (pending or current)');
    matchIndex = histories.findLastIndex((item) => {
      const itemStatus = String(item?.status || '').toLowerCase();
      return itemStatus === 'pending' || itemStatus === 'current';
    });
  }

  if (matchIndex === -1) {
    console.warn('[updateCustomerHistoryStatus] No pending history entry found');
    return { updated: false, reason: 'Matching pending history not found' };
  }

  console.log('[updateCustomerHistoryStatus] Updating history at index', matchIndex, 'from status:', histories[matchIndex].status, 'to:', status);

  histories[matchIndex] = {
    ...histories[matchIndex],
    status,
    updated_at: new Date().toISOString(),
  };

  const { error: historyUpdateError } = await supabase
    .from('customers_accounts')
    .update({ histories })
    .eq('id', customer.id);

  if (historyUpdateError) {
    console.error('[updateCustomerHistoryStatus] Update error:', historyUpdateError.message);
    return { updated: false, reason: historyUpdateError.message };
  }

  console.log('[updateCustomerHistoryStatus] ✓ History updated successfully for customer', customer.id);
  return { updated: true, customerId: customer.id, history: histories[matchIndex] };
};

export default async (req, res) => {
  console.log('[UpdateStatus] === REQUEST RECEIVED ===');
  console.log('[UpdateStatus] Method:', req.method);
  console.log('[UpdateStatus] Body:', req.body);
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, status, staffName } = req.body;

  console.log('[UpdateStatus] Extracted from body - id:', id, 'status:', status, 'staffName:', staffName);

  if (!id || !status) {
    console.error('[UpdateStatus] VALIDATION FAILED - Missing id or status');
    return res.status(400).json({ error: 'ID and status are required' });
  }

  const validStatuses = ['pending', 'current', 'done', 'cancelled'];
  if (!validStatuses.includes(status)) {
    console.error('[UpdateStatus] VALIDATION FAILED - Invalid status:', status);
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[UpdateStatus] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log(`[UpdateStatus] === STEP 1: Fetching slot with id=${id} ===`);

    const { data: slotData, error: slotFetchError } = await supabase
      .from('available_slots')
      .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status')
      .eq('id', id)
      .single();

    console.log('[UpdateStatus] Slot fetch - error:', slotFetchError);
    console.log('[UpdateStatus] Slot fetch - data:', slotData);

    if (slotFetchError) {
      console.error('[UpdateStatus] Slot fetch error:', slotFetchError);
      return res.status(500).json({ error: 'Failed to load appointment details', details: slotFetchError.message });
    }

    console.log(`[UpdateStatus] === STEP 2: Updating slot status to '${status}' ===`);
    const { data, error } = await supabase
      .from('available_slots')
      .update({ status })
      .eq('id', id)
      .select();

    console.log('[UpdateStatus] Slot update - error:', error);
    console.log('[UpdateStatus] Slot update - data:', data);

    if (error) {
      console.error('[UpdateStatus] Update error:', error);
      return res.status(500).json({ error: 'Failed to update status', details: error.message });
    }

    console.log(`[UpdateStatus] ✓ Slot status updated to '${status}'`);

    console.log(`[UpdateStatus] === STEP 3: Syncing customer history ===`);
    console.log('[UpdateStatus] Slot data for history sync:', {
      id: slotData?.id,
      customer_contact: slotData?.customer_contact,
      date: slotData?.date,
      assigned_staff: slotData?.assigned_staff,
      services: slotData?.services
    });
    
    const historySync = await updateCustomerHistoryStatus(supabase, slotData, status);
    console.log('[UpdateStatus] History sync result:', historySync);
    
    if (historySync.updated) {
      console.log('[UpdateStatus] ✓ Customer history status updated:', historySync.history);
    } else {
      console.warn('[UpdateStatus] ⚠ Customer history was not updated:', historySync.reason);
    }

    // Update staff in_service based on status
    if (staffName) {
      console.log(`[UpdateStatus] Processing staff update for: ${staffName}`);
      let staffInServiceValue = 'avail'; // default for 'done'
      
      if (status === 'current') {
        staffInServiceValue = 'in-service';
        console.log(`[UpdateStatus] Setting staff ${staffName} in_service to 'in-service'`);
      } else if (status === 'done') {
        staffInServiceValue = 'avail';
        console.log(`[UpdateStatus] Setting staff ${staffName} in_service to 'avail'`);
      }
      
      if (status === 'current' || status === 'done') {
        console.log(`[UpdateStatus] Querying staff table for name = '${staffName}'`);
        const { data: staffData, error: staffError } = await supabase
          .from('staffs')
          .update({ in_service: staffInServiceValue })
          .eq('names', staffName)
          .select();

        if (staffError) {
          console.error('[UpdateStatus] Staff update error:', staffError);
          console.error('[UpdateStatus] Error details:', staffError.message, staffError.code);
        } else {
          console.log(`[UpdateStatus] Staff update response:`, staffData);
          if (staffData && staffData.length > 0) {
            console.log(`[UpdateStatus] Successfully updated staff ${staffName} in_service to ${staffInServiceValue}`);
          } else {
            console.warn(`[UpdateStatus] No staff found with name: ${staffName}`);
          }
        }
      }
    } else {
      console.log(`[UpdateStatus] No staff name provided, skipping staff update`);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      appointment: data?.[0] || null,
      historyUpdated: historySync.updated,
      historyUpdateReason: historySync.updated ? null : historySync.reason
    });
    console.log('[UpdateStatus] === ✓ RESPONSE SENT SUCCESSFULLY ===');
  } catch (error) {
    console.error(`[UpdateStatus] === EXCEPTION CAUGHT ===`);
    console.error(`[UpdateStatus] Error message: ${error.message}`);
    console.error(`[UpdateStatus] Error stack:`, error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
