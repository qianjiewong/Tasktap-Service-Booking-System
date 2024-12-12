// src/app/api/getUserBookingHistory.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const userEmail = req.query.userId as string; // Retrieve user email from query
      const bookings = await prisma.booking.findMany({
        where: {
          userEmail: userEmail,
          status: 'cancelled', // Match bookings with user email
        },
        include: {
          contactPerson: true, // Include the contact person information if needed
          category: true, // Include the category information if needed
        },
      });
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      res.status(500).json({ error: 'Failed to fetch booking history' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
