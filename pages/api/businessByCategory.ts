import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId } = req.query; // Get categoryId from query

  if (req.method === 'GET') {
    try {
      if (categoryId) {
        // Fetch businesses by categoryId
        const businesses = await prisma.business.findMany({
          where: {
            categoryId: Number(categoryId), // Ensure categoryId is treated as a number
            adminStatus: 'approved',
            businessStatus: 'active',
          },
        });

        // Fetch category details (including name)
        const category = await prisma.category.findUnique({
          where: {
            id: Number(categoryId),
          },
        });

        // Return businesses and category name
        return res.status(200).json({ businesses, category });
      }

      // If no categoryId is passed, return all businesses
      const businesses = await prisma.business.findMany();
      res.status(200).json(businesses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch businesses' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
