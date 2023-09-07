import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already in use");
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }
    await User.create({ name, email, password: hashedPassword });
    console.log("User created");
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "An error occured when trying to register a user" },
      { status: 500 }
    );
  }
}
