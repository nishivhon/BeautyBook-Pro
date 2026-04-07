import { getStaffWithAnyOption } from '../../server/src/services/booking/read/staffService.js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Staffs] Fetching staff with any available option');
    const staff = await getStaffWithAnyOption();
    console.log(`[Staffs] Found ${staff.length} staff members`);

    res.status(200).json({
      any: {
        id: 'any',
        isAny: true,
        initial: null,
        name: 'Any available stylist',
        unavailable: false
      },
      staff: staff
    });
  } catch (error) {
    console.error(`[Staffs] Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch staff', details:error.message });
  }
};
