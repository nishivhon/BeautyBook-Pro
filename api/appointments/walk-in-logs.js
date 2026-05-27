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
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date parameter is required" });
    }

    console.log("[WalkInLogs] Fetching walk-ins for date:", date);

    // Get environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("[WalkInLogs] Missing Supabase configuration");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Try filtering by exact date match first, then fallback to date range
    let supabaseUrl = `${SUPABASE_URL}/rest/v1/walk_in_logs?date=eq.${date}&order=created_at.asc`;

    let response = await fetch(supabaseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    let walkInLogs = [];

    if (response.ok) {
      walkInLogs = await response.json();
      console.log("[WalkInLogs] Found by exact date match:", Array.isArray(walkInLogs) ? walkInLogs.length : 0, "items");
    } else {
      console.warn("[WalkInLogs] Exact date match failed, trying created_at range...");
      // If exact date fails, try filtering by created_at date range
      const nextDate = new Date(date + 'T23:59:59Z');
      const endDate = new Date(nextDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];

      supabaseUrl = `${SUPABASE_URL}/rest/v1/walk_in_logs?created_at=gte.${date}T00:00:00Z&created_at=lt.${endDateStr}T00:00:00Z&order=created_at.asc`;
      response = await fetch(supabaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        walkInLogs = await response.json();
        console.log("[WalkInLogs] Found by created_at range:", Array.isArray(walkInLogs) ? walkInLogs.length : 0, "items");
      } else {
        console.error("[WalkInLogs] Both queries failed - Supabase error:", response.status);
        const errorText = await response.text();
        console.error("[WalkInLogs] Error details:", errorText);
      }
    }

    console.log("[WalkInLogs] Total walk-ins returned:", Array.isArray(walkInLogs) ? walkInLogs.length : 0);
    if (Array.isArray(walkInLogs) && walkInLogs.length > 0) {
      console.log("[WalkInLogs] Sample:", JSON.stringify(walkInLogs[0]).substring(0, 300));
    }

    // Return the walk-in logs as an array
    return res.status(200).json(walkInLogs || []);

  } catch (err) {
    console.error("[WalkInLogs] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching walk-in logs",
      error: err.message,
    });
  }
};
