import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const { username: username, email: email } = await request.json();
  await connectMongoDB();
  await User.findByIdAndUpdate(id, { username, email });
  return NextResponse.json(
    {
      message: "New user information " + username + " " + email,
    },
    { status: 200 }
  );
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const user = await User.findOne({ _id: id });
  return NextResponse.json({ user }, { status: 200 });
}
