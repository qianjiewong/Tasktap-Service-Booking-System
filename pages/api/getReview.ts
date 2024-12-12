import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Adjust the path based on your db setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch only the first 5 reviews and ratings from the Booking table
      const reviews = await db.booking.findMany({
        where: {
          reviews: { not: "" }, // Only fetch bookings with non-empty reviews
          rating: { gt: 0 }, // Only fetch bookings with a rating greater than 0
        },
        include: {
          category: true, // Include category if necessary
          username: { // Include the user’s username from the User model based on userId
            select: {
              username: true,  // Get the 'username' field from the User model
            }
          },
        },
        take: 5, // Limit the results to the first 5
      });

      // Map the reviews data to return relevant fields
      const formattedReviews = reviews.map((review) => ({
        name: review.username?.username || 'Anonymous',  // Username or Anonymous if not available
        rating: review.rating, // The rating value
        review: review.reviews, // The review text
        serviceType: review.category?.name, // The category or service type
      }));

      // Send the formatted reviews as a JSON response
      res.status(200).json(formattedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
