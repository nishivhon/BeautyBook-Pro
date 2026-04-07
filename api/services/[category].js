import { getServicesByCategory } from '../../server/src/services/booking/read/serviceService.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Category parameter is required' });
  }

  try {
    console.log(`[Services] Fetching services for category: ${category}`);
    const services = await getServicesByCategory(category);
    console.log(`[Services] Found ${services.length} services in category`);

    res.status(200).json(services);
  } catch (error) {
    console.error(`[Services] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch services', details: error.message });
  }
};
