import { getAllStaff } from '../../server/src/services/booking/read/staffService.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Staffs] Fetching all staff');
    const staff = await getAllStaff();
    console.log(`[Staffs] Found ${staff.length} staff members`);

    res.status(200).json(staff);
  } catch (error) {
    console.error(`[Staffs] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch staff', details: error.message });
  }
};
