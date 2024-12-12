import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Month index (0-11)
    const currentYear = currentDate.getFullYear();

    // Current month range
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 1);

    // Previous month range
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthStart = new Date(previousYear, previousMonth, 1);
    const previousMonthEnd = new Date(previousYear, previousMonth + 1, 1);

    // Fetch revenue and bookings for current and previous months
    const currentMonthData = await prisma.business.findMany({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lt: currentMonthEnd,
        },
      },
      select: {
        price: true,
        bookings: true,
      },
    });

    const previousMonthData = await prisma.business.findMany({
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: previousMonthEnd,
        },
      },
      select: {
        price: true,
        bookings: true,
      },
    });

    // Calculate totals
    const currentMonthRevenue = currentMonthData.reduce(
      (sum, business) => sum + business.price * business.bookings,
      0
    );
    const currentMonthBookings = currentMonthData.reduce(
      (sum, business) => sum + business.bookings,
      0
    );

    const previousMonthRevenue = previousMonthData.reduce(
      (sum, business) => sum + business.price * business.bookings,
      0
    );
    const previousMonthBookings = previousMonthData.reduce(
      (sum, business) => sum + business.bookings,
      0
    );

    // Fetch the total number of businesses
    const totalBusinesses = await prisma.business.count();

    res.status(200).json({
      totalBusinesses,
      currentMonthRevenue,
      previousMonthRevenue,
      currentMonthBookings,
      previousMonthBookings,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats." });
  }
}
