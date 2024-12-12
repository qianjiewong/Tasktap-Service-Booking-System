import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, addressLine1, addressLine2, zip, city, state } = req.body;

  if (!email || !addressLine1 || !addressLine2 || !zip || !city || !state) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate ZIP code format
  const isValidZip = /^\d{5}$/.test(zip);
  if (!isValidZip) {
    return res.status(400).json({ error: "Invalid ZIP code format" });
  }

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user address
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        address: `${addressLine1}, ${addressLine2}, ${zip}, ${city}, ${state}`,
      },
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user address:", error.message);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: "Failed to update address" });
  }
}
