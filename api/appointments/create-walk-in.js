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

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { name, contact, stylist, services, refNo } = req.body;

    console.log("[Walk-in Log] Received request - name:", name);

    // Get environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    console.log("[Walk-in Log] SUPABASE_URL available:", !!SUPABASE_URL);
    console.log("[Walk-in Log] SUPABASE_ANON_KEY available:", !!SUPABASE_ANON_KEY);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("[Walk-in Log] Missing Supabase configuration");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: Missing Supabase credentials",
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: "Customer name is required" });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service is required" });
    }

    if (!stylist) {
      return res.status(400).json({ success: false, message: "Stylist assignment is required" });
    }

    // Prepare the data for insertion
    const today = new Date().toISOString().split("T")[0];
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
