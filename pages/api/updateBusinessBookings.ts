import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { businessId } = req.body;

      // Ensure that businessId is an integer
      const parsedBusinessId = parseInt(businessId, 10);
      
      // Check if the parsing was successful
      if (isNaN(parsedBusinessId)) {
        return res.status(400).json({ error: "Invalid businessId, must be a number" });
      }
      
      // Continue with the updated businessId
      console.log("Received businessId:", parsedBusinessId);
      
      // Check if the business exists
      const business = await db.business.findUnique({
        where: { id: parsedBusinessId },  // Use the parsed integer businessId
      });

      // If the business does not exist, return an error
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      console.log("Business found:", business);

      // Increment the bookings count by 1
      const updatedBusiness = await db.business.update({
        where: { id: parsedBusinessId },  // Use parsedBusinessId instead of businessId (string)
        data: {
          bookings: {
            increment: 1, // Increment the bookings count by 1
          },
        },
      });

      console.log("Updated business:", updatedBusiness);
      console.log("Updated business bookings successfully:", updatedBusiness);

      return res.status(200).json(updatedBusiness); // Return updated business
    } catch (error) {
      console.error("Error updating business bookings:", error);
      return res.status(500).json({ error: "Failed to update bookings" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
