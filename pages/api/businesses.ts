import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const businesses = await prisma.business.findMany({
        where: {
          adminStatus: 'approved',
          businessStatus: 'active',
        },
        orderBy: {
          bookings: 'desc', // Sort by the number of bookings in descending order
        },
        take: 6, // Limit the results to the top 6 businesses
        include: {
          category: true, // Include category information
        },
      });
      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  }
}
