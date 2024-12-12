// src/app/api/updateBusinessInformation/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {

    const { id } = req.query; // Get the business ID from the URL parameter
    const { name, about, address, price } = req.body; // Get the updated data from the request body
    console.log(
      "id: ", id,
      "name: ", name,
      "about: ", about,
      "address: ", address,
      "price: ", price,
    )

    // Ensure that id is valid and parsed correctly
    const parsedId = parseInt(id as string, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid business ID" });
    }

    console.log("Received businessId:", parsedId);

    // Ensure price is a valid number and greater than 0
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "Price must be a valid number greater than 0" });
    }


    try {
      // Update the business information
      const updatedBusiness = await prisma.business.update({
        where: { id: parsedId }, // Use the parsed ID for business
        data: {
          name,
          about,
          address,
          price: parsedPrice,
          adminStatus: "not approved",
        },
      });

      console.log("Updated business info:", updatedBusiness);
      console.log("Updated business info successfully:", updatedBusiness);

      return res.status(200).json(updatedBusiness); // Return updated business data
    } catch (error) {
      console.error("Error updating business:", error);
      return res.status(500).json({ error: "Failed to update business" });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
