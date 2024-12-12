import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

// Helper function to validate required fields
const validateRequiredFields = (body: any) => {
  const requiredFields = [
    "businessId",
    "email",
    "categoryId",
    "selectedDate",
    "selectedTime",
    "location",
    "status",
    "captureId",
    
  ];
  return requiredFields.every(
    (field) => body[field] !== undefined && body[field] !== null
  );
};

const formatTimeTo12Hour = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 hours to 12
  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("Raw request body:", JSON.stringify(body, null, 2));

      // Validate required fields
      if (!validateRequiredFields(body)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const {
        businessId,
        email,
        categoryId,
        selectedDate,
        selectedTime,
        location,
        status,
        captureId,
      } = body;

      // Explicitly sanitize and validate input fields
      const sanitizedBusinessId = parseInt(businessId, 10);
      const sanitizedCategoryId = parseInt(categoryId, 10);
      const sanitizedEmail = sanitizeString(email.trim());
      const sanitizedStatus = sanitizeString(status.trim());

      // Log sanitized values
      console.log("Sanitized values:", {
        businessId: sanitizedBusinessId,
        email: sanitizedEmail,
        categoryId: sanitizedCategoryId,
        selectedDate,
        selectedTime,
        status: sanitizedStatus,
        location: body.location,
        captureId,
      });

      // Validate numeric fields
      if (isNaN(sanitizedBusinessId) || isNaN(sanitizedCategoryId)) {
        return res
          .status(400)
          .json({ error: "Invalid business or category ID" });
      }

      // Check if the user exists
      let user = await db.user.findUnique({
        where: { email: sanitizedEmail },
      });

      // Create the user if they don't exist
      if (!user) {
        user = await db.user.create({
          data: {
            email: sanitizedEmail,
          },
        });
      }

      const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      };

      // Parse and validate the selected date
      const parsedDate = new Date(selectedDate);

      // Format the date to YYYY-MM-DD
      const dateOnly = formatDateToYYYYMMDD(parsedDate);

      console.log("Parsed date:", dateOnly);

      // Parse time correctly without associating it with a date
      const [timeHours, timeMinutes, period] = selectedTime.split(/[: ]/);
      const hour =
        period === "PM"
          ? (parseInt(timeHours) % 12) + 12
          : parseInt(timeHours) % 12;

      // Format the time to 12-hour format
      const timeOnly = formatTimeTo12Hour(
        `${hour.toString().padStart(2, "0")}:${timeMinutes.padStart(2, "0")}`
      );

      console.log("Parsed date and time:", dateOnly, timeOnly);

      // **Check if the selected time slot for the business is already booked**
      const existingBooking = await db.booking.findFirst({
        where: {
          contactPersonId: sanitizedBusinessId,
          date: dateOnly,
          time: timeOnly,
        },
      });

      if (existingBooking) {
        return res
          .status(400)
          .json({ error: "The selected time slot is already booked" });
      }

      // Create new booking if the time slot is available
      const newBooking = await db.booking.create({
        data: {
          contactPerson: {
            connect: { id: sanitizedBusinessId },
          },
          userEmail: sanitizedEmail,
          username: {
            connect: { id: user.id },
          },
          category: {
            connect: { id: sanitizedCategoryId },
          },
          date: dateOnly, // Store the date as a string in 'YYYY-MM-DD' format
          time: timeOnly, // Store the time in 12-hour format string
          location: location,
          status: sanitizedStatus,
          reviews: '',
          captureId, 
        },
      });

      console.log("New booking created:", newBooking);
      return res.status(201).json(newBooking);
    } catch (error) {
      console.error("Error creating booking:", JSON.stringify(error, null, 2));
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create booking";
      return res.status(500).json({ error: errorMessage });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

// Function to sanitize strings
function sanitizeString(str: string) {
  // Remove null bytes and any non-printable characters
  const cleaned = str.replace(/\0/g, "").replace(/[^\x20-\x7E]/g, "");
  if (cleaned !== str) {
    console.warn(`Sanitized input from "${str}" to "${cleaned}"`);
  }
  return cleaned;
}
