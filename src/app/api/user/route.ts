import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import * as z from "zod";

// Define a schema from input validation
const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(\+?\d{1,3}[-.\s]?)?\d{10}$/, "Invalid phone number format"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password, phone } = userSchema.parse(body);

    //check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { customer: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    //check if user name already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { customer: null, message: "User with this username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { customer: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
