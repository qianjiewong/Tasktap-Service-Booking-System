import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { id } = req.query;
  const { adminStatus } = req.body;

  if (!id || typeof adminStatus !== "string") {
    return res.status(400).json({ error: "Business ID and admin status are required." });
  }

  try {
    const updatedBusiness = await prisma.business.update({
      where: { id: Number(id) },
      data: { adminStatus },
    });

    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error("Error approving business:", error);
    res.status(500).json({ error: "Failed to approve business." });
  }
}
