import { createClient } from '@supabase/supabase-js';
import { findStaffScheduleConflict, getPhtDateString, getPhtTimeString, getServiceDurationMinutes, resolveStaffLabel } from './utils/staffConflict.js';

export default async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });

    const today = getPhtDateString();
    const startTime = getPhtTimeString();
    const resolvedStylist = resolveStaffLabel(stylist);
    const durationMinutes = getServiceDurationMinutes(services);

    const conflict = await findStaffScheduleConflict({
      supabase,
      date: today,
      startTime,
      durationMinutes,
      staff: resolvedStylist,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Stylist is already occupied for part of the walk-in window.",
        conflict,
      });
    }
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

      assigned_staff: resolvedStylist,
    const { name, contact, stylist, services, refNo } = req.body;

    console.log("[Walk-in Log] Received request - name:", name);

    // Get environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;

    const { data: responseData, error: insertError } = await supabase
      .from('walk_in_logs')
      .insert(walkInData)
      .select();

    if (insertError) {
      console.error("[Walk-in Log] Supabase error:", insertError.message);
      return res.status(400).json({
        success: false,
        message: "Failed to insert walk-in data",
        details: insertError.message,
      });
    }
    const walkInData = {
      date: today,
      customer_name: name.trim(),
      customer_contact: contact?.trim() || null,
      assigned_staff: typeof stylist === 'object' ? stylist.name : stylist,
      services: services,
      status: "pending",
      availability: true,
    };

    console.log("[Walk-in Log] Inserting:", JSON.stringify(walkInData));

    // Call Supabase REST API
    const supabaseUrl = `${SUPABASE_URL}/rest/v1/walk_in_logs`;
    
    const response = await fetch(supabaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=representation",
      },
      body: JSON.stringify(walkInData),
    });

    const responseText = await response.text();
    console.log("[Walk-in Log] Supabase response status:", response.status);

    if (!response.ok) {
      console.error("[Walk-in Log] Supabase error:", responseText);
      return res.status(response.status).json({
        success: false,
        message: "Failed to insert walk-in data",
        details: responseText,
      });
    }

    const responseData = responseText ? JSON.parse(responseText) : null;
    console.log("[Walk-in Log] Successfully inserted walk-in");

    return res.status(201).json({
      success: true,
      message: "Walk-in logged successfully",
      data: responseData,
    });

  } catch (err) {
    console.error("[Walk-in Log] Error:", err.message);
    console.error("[Walk-in Log] Stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Error creating walk-in log",
      error: err.message,
    });
  }
};
