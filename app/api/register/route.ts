import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "all feilds are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ error: "Email already exsite" });
    }
    const hashpass = await bcrypt.hash(password, 10);
    const options = new User({
      username,
      email,
      password: hashpass,
    });
    const newuser = await options.save();
    return NextResponse.json(
      { message: "user data succesffully created", newuser },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({error:"server error"})
  }
}
