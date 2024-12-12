import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Adjust the path based on your db setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { businessId } = req.query;
      if (!businessId) {
        return res.status(400).json({ error: 'Business ID is required' });
      }

      // Fetch reviews and ratings from the Booking table, limiting the result to 3 reviews
      const reviews = await db.booking.findMany({
        where: {
          contactPersonId: Number(businessId), // Filter by business ID
          reviews: { not: "" }, // Only fetch bookings with non-empty reviews
          rating: { gt: 0 }, // Only fetch bookings with a rating greater than 0
        },
        take: 3, // Limit to 3 reviews
        include: {
          category: true, // Include category if necessary
          username: {
            select: {
                username: true,
            }
          }
        },
      });

      // Map the reviews data to return relevant fields
      const formattedReviews = reviews.map((review) => ({
        name: review.username?.username || 'Anonymous', // Get the username from the User model
        rating: review.rating, // The rating value
        comment: review.reviews, // The review text
        date: review.createdAt, // Review creation date
        serviceType: review.category?.name || 'Unknown Service', // The category name
      }));

      console.log(reviews)
      res.status(200).json(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
