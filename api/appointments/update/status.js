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

/**
 * Extract service names from slot services (handles various formats)
 * Returns array of service names
 */
const getServiceNamesArray = (slot) => {
  if (!slot?.services) {
    return ['Service pending'];
  }

  if (typeof slot.services === 'string') {
    return [slot.services];
  }

  if (Array.isArray(slot.services)) {
    return slot.services
      .map((service) => service?.name || service?.title || service)
      .filter(Boolean);
  }

  if (typeof slot.services === 'object') {
    if (slot.services.name) {
      return [slot.services.name];
    }

    const names = Object.values(slot.services).flat().filter(Boolean);
    return names.length > 0 ? names : ['Service pending'];
  }

  return ['Service pending'];
};

/**
 * Fetch service prices for given service names
 */
const getServicePrices = async (supabase, serviceNames) => {
  try {
    console.log('[Status] Fetching prices for services:', serviceNames);
    
    const { data: services, error } = await supabase
      .from('services')
      .select('service_name, price')
      .in('service_name', serviceNames);

    if (error) {
      console.error('[Status] Error fetching service prices:', error);
      return {};
    }

    // Build service name -> price map
    const priceMap = {};
    services.forEach(svc => {
      priceMap[svc.service_name] = svc.price || 0;
    });

    console.log('[Status] Service price map:', priceMap);
    return priceMap;
  } catch (err) {
    console.error('[Status] Exception fetching service prices:', err);
    return {};
  }
};

/**
 * Calculate total price for appointment based on services
 */
const calculateTotalPrice = (serviceNames, priceMap) => {
  let total = 0;
  serviceNames.forEach(name => {
    total += priceMap[name] || 0;
  });
  return total;
};

/**
 * Create a complete history entry when appointment is marked as "done"
 */
const createDoneHistoryEntry = async (supabase, slot) => {
  console.log('[Status:CreateDoneHistory] Creating history entry for slot:', { id: slot?.id, date: slot?.date });

  try {
    const serviceNames = getServiceNamesArray(slot);
    const priceMap = await getServicePrices(supabase, serviceNames);
    const totalPrice = calculateTotalPrice(serviceNames, priceMap);

    const historyEntry = {
      id: slot.id,
      date: slot.date,
      price: totalPrice,
      staff: slot.assigned_staff || 'Unknown Staff',
      service: getServiceNameFromSlot(slot),
      status: 'done',
      rated: false,
      rating: 0,
      created_at: slot.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('[Status:CreateDoneHistory] Created history entry:', historyEntry);
    return historyEntry;
  } catch (err) {
    console.error('[Status:CreateDoneHistory] Error creating history entry:', err);
    return null;
  }
};

/**
 * Add done history entry to customer's histories
 */
const addDoneHistoryToCustomer = async (supabase, slot) => {
  console.log('[Status:AddDoneHistory] Adding done history for customer:', slot?.customer_contact);

  const customerContact = slot?.customer_contact;
  if (!customerContact) {
    console.warn('[Status:AddDoneHistory] No customer contact provided');
    return { updated: false, reason: 'No customer contact' };
  }

  const contactValue = String(customerContact).trim();
  const isEmail = contactValue.includes('@');

  try {
    // Find customer by email or phone
    const customerQuery = supabase
      .from('customers_accounts')
      .select('id, histories');

    const { data: customers, error: customerError } = isEmail
      ? await customerQuery.eq('email', contactValue).limit(1)
      : await customerQuery.eq('phone', contactValue).limit(1);

    if (customerError) {
      console.error('[Status:AddDoneHistory] Customer lookup error:', customerError);
      return { updated: false, reason: customerError.message };
    }

    const customer = customers?.[0];
    if (!customer) {
      console.warn('[Status:AddDoneHistory] Customer not found with contact:', contactValue);
      return { updated: false, reason: 'Customer not found' };
    }

    console.log('[Status:AddDoneHistory] Found customer:', customer.id);

    // Create the history entry
    const historyEntry = await createDoneHistoryEntry(supabase, slot);
    if (!historyEntry) {
      return { updated: false, reason: 'Failed to create history entry' };
    }

    // Normalize existing histories
    let histories = [];
    if (customer.histories) {
      if (typeof customer.histories === 'string') {
        try {
          histories = JSON.parse(customer.histories);
        } catch {
          histories = [];
        }
      } else if (Array.isArray(customer.histories)) {
        histories = customer.histories;
      }
    }

    // Add new entry
    histories.push(historyEntry);

    // Update customer with new history
    const { error: updateError } = await supabase
      .from('customers_accounts')
      .update({ histories })
      .eq('id', customer.id);

    if (updateError) {
      console.error('[Status:AddDoneHistory] Failed to update customer:', updateError);
      return { updated: false, reason: updateError.message };
    }

    console.log('[Status:AddDoneHistory] ✓ Successfully added done history entry');
    return { updated: true, customerId: customer.id, history: historyEntry };
  } catch (err) {
    console.error('[Status:AddDoneHistory] Exception:', err);
    return { updated: false, reason: err.message };
  }
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

  const { id, status, staffName: incomingStaffName } = req.body;

  console.log('[UpdateStatus] Extracted from body - id:', id, 'status:', status, 'staffName:', incomingStaffName);

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

    const isUuid = (value) =>
      typeof value === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

    const isWalkInPrefixedId = typeof id === 'string' && id.startsWith('walkin-');
    const normalizedWalkInId = isWalkInPrefixedId ? id.replace(/^walkin-/, '') : id;

    console.log(`[UpdateStatus] === STEP 1: Fetching slot with id=${id} ===`);

    // First try to fetch from available_slots
    let isWalkIn = false;

    let actualSlotData = null;
    let slotData = null;
    let slotFetchError = null;

    if (!isWalkInPrefixedId && isUuid(id)) {
      const availableSlotResult = await supabase
        .from('available_slots')
        .select('id, date, time_slot, customer_name, customer_contact, assigned_staff, services, status, created_at')
        .eq('id', id)
        .single();

      slotData = availableSlotResult.data;
      slotFetchError = availableSlotResult.error;

      console.log('[UpdateStatus] Slot fetch from available_slots - error:', slotFetchError?.message);
      console.log('[UpdateStatus] Slot fetch - data:', slotData);
    } else {
      console.log('[UpdateStatus] Skipping available_slots lookup for walk-in prefixed or non-UUID id');
    }

    // If not found in available_slots, try walk_in_logs
    actualSlotData = slotData;
    if (slotFetchError || !slotData || isWalkInPrefixedId) {
      console.log('[UpdateStatus] Slot not found in available_slots, trying walk_in_logs...');
      const walkInQuery = supabase
        .from('walk_in_logs')
        .select('id, date, customer_name, customer_contact, assigned_staff, services, status, created_at');

      const walkInResult = isWalkInPrefixedId || !isUuid(id)
        ? await walkInQuery.eq('id', normalizedWalkInId).single()
        : await walkInQuery.eq('id', id).single();

      const { data: walkInData, error: walkInFetchError } = walkInResult;

      console.log('[UpdateStatus] Slot fetch from walk_in_logs - error:', walkInFetchError?.message);
      console.log('[UpdateStatus] Walk-in data:', walkInData);

      if (walkInFetchError || !walkInData) {
        console.error('[UpdateStatus] Slot not found in either table. Original error:', slotFetchError?.message);
        return res.status(500).json({ error: 'Failed to load appointment details', details: slotFetchError?.message || walkInFetchError?.message });
      }

      isWalkIn = true;
      actualSlotData = walkInData;
    }

    console.log('[UpdateStatus] Using slot from:', isWalkIn ? 'walk_in_logs' : 'available_slots');
    console.log(`[UpdateStatus] === STEP 2: Updating slot status to '${status}' ===`);
    
    // Update the appropriate table
    const updateQuery = supabase
      .from(isWalkIn ? 'walk_in_logs' : 'available_slots')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', isWalkIn ? normalizedWalkInId : id)
      .select();

    const { data, error } = await updateQuery;

    console.log('[UpdateStatus] Slot update - error:', error?.message);
    console.log('[UpdateStatus] Slot update - data:', data);

    if (error) {
      console.error('[UpdateStatus] Update error:', error);
      return res.status(500).json({ error: 'Failed to update status', details: error.message });
    }

    console.log(`[UpdateStatus] ✓ Slot status updated to '${status}'`);

    console.log(`[UpdateStatus] === STEP 3: Syncing customer history ===`);
    console.log('[UpdateStatus] Slot data for history sync:', {
      id: actualSlotData?.id,
      customer_contact: actualSlotData?.customer_contact,
      date: actualSlotData?.date,
      assigned_staff: actualSlotData?.assigned_staff,
      services: actualSlotData?.services
    });
    
    let historySync;
    
    // When status is 'done', create a new complete history entry
    // Otherwise update the existing history entry status
    if (status === 'done') {
      console.log('[UpdateStatus] Status is "done" - creating new complete history entry');
      historySync = await addDoneHistoryToCustomer(supabase, actualSlotData);
    } else {
      console.log('[UpdateStatus] Status is "' + status + '" - updating existing history entry');
      historySync = await updateCustomerHistoryStatus(supabase, actualSlotData, status);
    }
    
    console.log('[UpdateStatus] History sync result:', historySync);
    
    if (historySync.updated) {
      console.log('[UpdateStatus] ✓ Customer history updated:', historySync.history);
    } else {
      console.warn('[UpdateStatus] ⚠ Customer history was not updated:', historySync.reason);
    }

    // Update staff in_service based on status
    const resolvedStaffName = incomingStaffName || actualSlotData?.assigned_staff || null;

    if (resolvedStaffName) {
      console.log(`[UpdateStatus] Processing staff update for: ${resolvedStaffName}`);
      let staffInServiceValue = 'avail'; // default for 'done'
      let walkInValue = null;
      
      if (status === 'current') {
        staffInServiceValue = 'in-service';
        walkInValue = false;
        console.log(`[UpdateStatus] Setting staff ${resolvedStaffName} in_service to 'in-service'`);
      } else if (status === 'done') {
        staffInServiceValue = 'avail';
        if (isWalkIn) {
          walkInValue = true;
        }
        console.log(`[UpdateStatus] Setting staff ${resolvedStaffName} in_service to 'avail'`);
      }
      
      if (status === 'current' || status === 'done') {
        console.log(`[UpdateStatus] Querying staff table for name = '${resolvedStaffName}'`);
        const staffUpdateData = { in_service: staffInServiceValue };
        if (walkInValue !== null) {
          staffUpdateData.walk_in = walkInValue;
        }

        const { data: staffData, error: staffError } = await supabase
          .from('staffs')
          .update(staffUpdateData)
          .eq('names', resolvedStaffName)
          .select();

        if (staffError) {
          console.error('[UpdateStatus] Staff update error:', staffError);
          console.error('[UpdateStatus] Error details:', staffError.message, staffError.code);
        } else {
          console.log(`[UpdateStatus] Staff update response:`, staffData);
          if (staffData && staffData.length > 0) {
            console.log(`[UpdateStatus] Successfully updated staff ${resolvedStaffName} in_service to ${staffInServiceValue}`);
          } else {
            console.warn(`[UpdateStatus] No staff found with name: ${resolvedStaffName}`);
          }
        }
      }
    } else {
      console.log(`[UpdateStatus] No staff name provided, skipping staff update`);
    }

    // If slot transitioned to 'done' (and wasn't already done), increment staff counters.
    try {
      const previousStatus = actualSlotData?.status;
      if (status === 'done' && previousStatus !== 'done' && resolvedStaffName) {
        console.log('[UpdateStatus] Incrementing staff counters for', resolvedStaffName);

        // Fetch current staff counters
        const { data: staffRows, error: staffFetchErr } = await supabase
          .from('staffs')
          .select('id, total_clients, done_clients, total_walk_in')
          .eq('names', resolvedStaffName)
          .limit(1);

        if (staffFetchErr) {
          console.error('[UpdateStatus] Failed to fetch staff counters:', staffFetchErr.message);
        } else if (!staffRows || staffRows.length === 0) {
          console.warn('[UpdateStatus] No staff row found to increment for', resolvedStaffName);
        } else {
          const staffRow = staffRows[0];
          const updateObj = {};

          // If this was a walk-in appointment, increment total_walk_in
          if (isWalkIn) {
            updateObj.total_walk_in = (Number(staffRow.total_walk_in) || 0) + 1;
            updateObj.done_clients = (Number(staffRow.done_clients) || 0) + 1;
          } else {
            updateObj.total_clients = (Number(staffRow.total_clients) || 0) + 1;
            updateObj.done_clients = (Number(staffRow.done_clients) || 0) + 1;
          }

          const { data: updatedStaff, error: staffIncErr } = await supabase
            .from('staffs')
            .update(updateObj)
            .eq('id', staffRow.id)
            .select();

          if (staffIncErr) {
            console.error('[UpdateStatus] Error incrementing staff counters:', staffIncErr.message);
          } else {
            console.log('[UpdateStatus] Staff counters incremented:', updatedStaff);
          }
        }
      }
    } catch (incErr) {
      console.error('[UpdateStatus] Exception while incrementing staff counters:', incErr);
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
