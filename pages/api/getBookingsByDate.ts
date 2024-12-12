import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { date } = req.query;

    // Ensure date is a string
    if (!date || Array.isArray(date)) {
      return res
        .status(400)
        .json({ error: "Date must be a single string value." });
    }

    try {
      const bookings = await db.booking.findMany({
        where: {
          date: {
            equals: date, // Now date is guaranteed to be a string
          },
        },
        select: {
          time: true, // Adjust this to your actual field names
        },
      });

      return res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
