import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { businessId } = req.query;

  if (!businessId) {
    return res.status(400).json({ error: "Business ID is required" });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: Number(businessId) },
    });

    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }

    res.status(200).json({ name: business.name });
  } catch (error) {
    console.error("Error fetching business details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
