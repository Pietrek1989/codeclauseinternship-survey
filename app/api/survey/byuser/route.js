import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import Survey from "@/models/survey";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const body = await req.json();
  const { name, email } = body;

  console.log("Name:", name);
  console.log("Email:", email);

  await connectMongoDB();

  const user = await User.findOne({ email, name }).populate("surveys");

  if (user) {
    return NextResponse.json({ user });
  } else {
    return NextResponse.json({ message: "Eror" });
  }
}
