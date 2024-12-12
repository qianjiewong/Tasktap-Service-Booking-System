import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { bookingId, rating, review } = req.body;
      console.log("Received booking ID:", bookingId, "Rating:", rating, "Review:", review);

      // Validate input
      if (!bookingId || typeof rating !== 'number') {
        return res.status(400).json({ error: 'Invalid booking ID or rating' });
      }

      const reviewText = review ? review : '';

      // Update the booking in the database
      const updatedBooking = await db.booking.update({
        where: { id: Number(bookingId) },
        data: { rating,
                reviews: reviewText,
        },

      });

      return res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking rating:', error);
      return res.status(500).json({ error: 'Failed to update booking rating' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
