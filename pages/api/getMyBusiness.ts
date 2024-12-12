import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust this import based on your project structure
import { db } from '@/lib/db'; // Adjust this import based on your project structure

const getMyBusiness = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure this API route only allows GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the session to retrieve user information
  const session = await getServerSession(req, res, authOptions);

  const userEmail = session?.user?.email; // Get the email from the session

  if (!userEmail) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Fetch the businesses based on the user's email
    const businesses = await db.business.findMany({
      where: {
        email: userEmail, // Now it's guaranteed to be a string
      },
      include: {
        category: true, // Include the related category data
        Booking: true,  // Include all bookings to calculate the average rating manually
      },
    });

    // If no businesses found, return 404
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Calculate average rating for each business based on bookings with rating > 0
    const businessesWithAvgRating = businesses.map((business) => {
      // Filter bookings with rating > 0
      const ratedBookings = business.Booking.filter((booking) => booking.rating > 0);

      // Calculate average rating
      const averageRating = ratedBookings.length
        ? ratedBookings.reduce((sum, booking) => sum + booking.rating, 0) / ratedBookings.length
        : null; // If no ratings, set to null

      return {
        ...business,
        averageRating, // Add the calculated average rating
      };
    });

    // Return the businesses with their average ratings
    return res.status(200).json(businessesWithAvgRating);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getMyBusiness;
