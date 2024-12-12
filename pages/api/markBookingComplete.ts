import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.body; // Get the booking ID from the request body

    if (!id) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    try {
      const booking = await db.booking.update({
        where: { id: id },
        data: { status: 'completed' }, // Update the status to completed
      });

      // Log the successful update
      console.log(`Booking ID ${id} marked as completed`);

      // Optionally return the updated booking data
      res.status(200).json({ message: 'Booking status updated to completed', booking });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
