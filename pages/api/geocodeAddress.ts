import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res
      .status(400)
      .json({ error: "Address is required for geocoding." });
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || data.results.length === 0) {
      return res.status(404).json({
        error: "Address not found. Please enter a valid address.",
      });
    }

    const location = data.results[0].geometry.location;
    res.status(200).json({
      latitude: location.lat,
      longitude: location.lng,
    });
  } catch (error) {
    console.error("Geocoding API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
