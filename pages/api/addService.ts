import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

const validateRequiredFields = (fields: any) => {
  const requiredFields = ["name", "contactPerson", "address", "about", "categoryId", "email", "price", "images"];
  return requiredFields.every((field) => fields[field] !== undefined && fields[field] !== null);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, contactPerson, address, about, categoryId, email, price, images } = req.body;

    if (!validateRequiredFields({ name, contactPerson, address, about, categoryId, email, price, images })) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const sanitizedImages = images.map((img: string) => img.trim());
    const constructedAddress = `${address.addressLine1}, ${address.addressLine2}, ${address.postcode}, ${address.city}, ${address.state}`;

    const newBusiness = await db.business.create({
      data: {
        name,
        contactPerson,
        address: constructedAddress,
        about,
        categoryId: parseInt(categoryId, 10),
        email,
        price: parseFloat(price),
        image: sanitizedImages,
        bookings: 0,
        rating: 0,
      },
    });

    return res.status(201).json({ message: "Business created successfully", newBusiness });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
}
