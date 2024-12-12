// import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { latitude, longitude, categoryId } = req.query;

//   console.log("Received Coordinates:", { latitude, longitude });

//   if (!latitude || !longitude) {
//     return res
//       .status(400)
//       .json({ error: "Latitude and Longitude are required." });
//   }

//   const userLat = parseFloat(latitude as string);
//   const userLng = parseFloat(longitude as string);
//   const radius = 45; // Radius in kilometers
//   const categoryFilter = categoryId ? parseInt(categoryId as string) : null;

//   // Haversine formula to calculate the distance between two points
//   const calculateDistance = (
//     lat1: number,
//     lon1: number,
//     lat2: number,
//     lon2: number
//   ) => {
//     const toRadians = (degree: number) => (degree * Math.PI) / 180;
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = toRadians(lat2 - lat1);
//     const dLon = toRadians(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in kilometers
//   };

//   const getCoordinates = async (address: string) => {
//     const apiKey = process.env.GOOGLE_GEOCODING_API;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//       address
//     )}&key=${apiKey}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === "OK" && data.results.length > 0) {
//       const location = data.results[0].geometry.location;
//       return { latitude: location.lat, longitude: location.lng };
//     } else {
//       console.error(`Geocoding failed for address: ${address}`);
//       return null;
//     }
//   };

//   try {
//     if (req.method === "GET") {
//       // Fetch businesses filtered by categoryId if provided
//       const businesses = await prisma.business.findMany({
//         where: {
//           ...(categoryFilter && { categoryId: categoryFilter }),
//           adminStatus: "approved",
//           businessStatus: "active",
//         },
//         include: { category: true }, // Include category information
//       });

//       const category = categoryFilter
//         ? await prisma.category.findUnique({
//             where: { id: categoryFilter },
//           })
//         : null;

//       const nearbyBusinesses = [];

//       for (const business of businesses) {
//         const { address, name, id, contactPerson, image, bookings } = business;

//         // Geocode the address
//         const coordinates = await getCoordinates(address);

//         if (!coordinates) {
//           console.error(
//             `Skipping business due to missing coordinates: ${name}`
//           );
//           continue; // Skip if geocoding fails
//         }

//         const { latitude: businessLat, longitude: businessLng } = coordinates;

//         // Calculate distance
//         const distance = calculateDistance(
//           userLat,
//           userLng,
//           businessLat,
//           businessLng
//         );

//         if (distance <= radius) {
//           nearbyBusinesses.push({
//             id,
//             name,
//             contactPerson,
//             address,
//             image,
//             bookings,
//             distance,
//             category: business.category?.name || "Uncategorized",
//           });
//         }
//       }

//       res.status(200).json({
//         businesses: nearbyBusinesses,
//         category: category ? { name: category.name } : null,
//       });
//     } else {
//       res.status(405).json({ message: "Method not allowed" });
//     }
//   } catch (error) {
//     console.error("Error fetching businesses:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { latitude, longitude, categoryId } = req.query;

  console.log("Received Coordinates:", { latitude, longitude });

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }

  const userLat = parseFloat(latitude as string);
  const userLng = parseFloat(longitude as string);
  const radius = 45; // Radius in kilometers
  const categoryFilter = categoryId ? parseInt(categoryId as string) : null;

  // Haversine formula to calculate the distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const getCoordinates = async (address: string) => {
    const apiKey = process.env.GOOGLE_GEOCODING_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } else {
      console.error(`Geocoding failed for address: ${address}`);
      return null;
    }
  };

  try {
    if (req.method === "GET") {
      // Fetch businesses filtered by categoryId if provided
      const businesses = await prisma.business.findMany({
        where: {
          ...(categoryFilter && { categoryId: categoryFilter }),
          adminStatus: "approved",
          businessStatus: "active",
        },
        include: { category: true }, // Include category information
      });

      const category = categoryFilter
        ? await prisma.category.findUnique({
            where: { id: categoryFilter },
          })
        : null;

      const nearbyBusinesses = [];

      for (const business of businesses) {
        const { address, name, id, contactPerson, image, bookings } = business;

        // Geocode the address
        const coordinates = await getCoordinates(address);

        if (!coordinates) {
          console.error(
            `Skipping business due to missing coordinates: ${name}`
          );
          continue; // Skip if geocoding fails
        }

        const { latitude: businessLat, longitude: businessLng } = coordinates;

        // Calculate distance
        const distance = calculateDistance(
          userLat,
          userLng,
          businessLat,
          businessLng
        );

        if (distance <= radius) {
          nearbyBusinesses.push({
            id,
            name,
            contactPerson,
            address,
            image,
            bookings,
            distance,
            category: business.category?.name || "Uncategorized",
          });
        }
      }

      res.status(200).json({
        businesses: nearbyBusinesses,
        category: category ? { name: category.name } : null,
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

