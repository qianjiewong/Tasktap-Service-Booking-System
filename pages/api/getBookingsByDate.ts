import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { date, businessId } = req.query;

    // Ensure date and businessId are valid strings
    if (!date || Array.isArray(date) || !businessId || Array.isArray(businessId)) {
      return res.status(400).json({ error: "Date and businessId must be single string values." });
    }

    try {
      const bookings = await db.booking.findMany({
        where: {
          date: {
            equals: date, // Ensure the date matches
          },
          contactPersonId: {
            equals: parseInt(businessId), // Convert businessId to integer
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
