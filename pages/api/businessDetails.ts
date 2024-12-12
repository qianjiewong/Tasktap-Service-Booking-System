import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { businessId } = req.query;

  if (req.method === 'GET') {
    try {
      const business = await prisma.business.findUnique({
        where: {
          id: Number(businessId),
        },
        include: {
          category: true,
          Booking: true, // Include the Booking relation to calculate ratings
        },
      });

      if (!business) {
        return res.status(404).json({ error: 'Business not found' });
      }

      // Calculate the average rating for the business (only count ratings > 0)
      const ratings = business.Booking.filter(booking => booking.rating > 0).map((booking) => booking.rating);
      const averageRating = ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      // Count the total number of ratings (ratings > 0)
      const totalRatings = business.Booking.filter(booking => booking.rating > 0).length;

      // Return the business details along with averageRating and totalRatings
      const businessWithRating = {
        ...business,
        averageRating: averageRating.toFixed(1),
        totalRatings, // Add total ratings count here
      };

      res.status(200).json(businessWithRating);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch business details' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

