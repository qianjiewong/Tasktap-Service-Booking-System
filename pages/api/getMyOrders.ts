// /api/getUserBookings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query; // Get the email from the query

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const bookings = await db.booking.findMany({
      where: {
        contactPerson: {
          email: email,
        },
      },
      include: {
        category: true, // Include category if needed
        contactPerson: true, // Include contact person details
      },
    });
    
      

    res.status(200).json(bookings); // Return the bookings
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
