import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    const { id } = req.query; // Extract business ID from query parameters
    const { businessStatus } = req.body; // Extract new business status from request body

    // Validate the input
    if (!id || typeof businessStatus !== "string") {
      return res.status(400).json({ error: "Invalid request data" });
    }

    try {
      // Update the business status in the database
      const updatedBusiness = await prisma.business.update({
        where: {
          id: Number(id), // Ensure the ID is a number
        },
        data: {
          businessStatus, // Update the businessStatus field
        },
      });

      // Return the updated business information
      return res.status(200).json({
        message: "Business status updated successfully",
        business: updatedBusiness,
      });
    } catch (error) {
      console.error("Error updating business status:", error);
      return res.status(500).json({ error: "Failed to update business status" });
    }
  } else {
    // Respond with 405 Method Not Allowed for non-PATCH requests
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
