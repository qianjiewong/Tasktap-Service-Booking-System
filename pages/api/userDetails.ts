import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the user's session
    const session = await getSession({ req });

    if (!session || !session.user?.email) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Extract the user's email from the session
    const userEmail = session.user.email;

    // Fetch the user's details from the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        username: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    console.log("Fetched user details from DB:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return the user's details
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
