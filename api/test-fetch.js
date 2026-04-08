export default async (req, res) => {
  console.log('[TEST] Starting fetch test...');
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('[TEST] ⏰ Timeout triggered!');
      controller.abort();
    }, 5000);

    console.log('[TEST] Fetching from httpbin.org...');
    const response = await fetch('https://httpbin.org/get', {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    console.log('[TEST] ✅ Response:', response.status);
    
    return res.json({ success: true, status: response.status });
  } catch (error) {
    console.error('[TEST] ❌ Error:', error.name, error.message);
    return res.status(500).json({ error: error.message });
  }
};
