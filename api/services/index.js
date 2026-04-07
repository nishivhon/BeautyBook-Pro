import { getAllServices } from '../../server/src/services/booking/read/serviceService.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Services] Fetching all services');
    const services = await getAllServices();
    console.log(`[Services] Found ${services.length} services`);

    res.status(200).json(services);
  } catch (error) {
    console.error(`[Services] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
};
