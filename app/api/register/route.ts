import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import DatabaseConnection from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    await DatabaseConnection()
    const body = await request.json();

    const { email, password, username } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      username,
      email,
      password: hashpass,
    });

    return NextResponse.json(
      {
        message: "User successfully created",
        user: newuser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("USER CREATE ERROR:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}