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

    // Fetch walk-in logs for the specified date
    const supabaseUrl = `${SUPABASE_URL}/rest/v1/walk_in_logs?date=eq.${date}&order=created_at.asc`;
    
    const response = await fetch(supabaseUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("[WalkInLogs] Supabase error:", response.status);
      const errorText = await response.text();
      console.error("[WalkInLogs] Error details:", errorText);
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch walk-in logs",
      });
    }

    const walkInLogs = await response.json();
    console.log("[WalkInLogs] Fetched walk-ins:", Array.isArray(walkInLogs) ? walkInLogs.length : 0, "items");
    console.log("[WalkInLogs] Raw response:", JSON.stringify(walkInLogs).substring(0, 200));

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
