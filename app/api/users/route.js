import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, surname, email } = await request.json();
    await connectMongoDB();
    await User.create({ name, surname, email });
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log("error", error);
  }
}
export async function GET() {
  await connectMongoDB();
  const users = await User.find();
  return NextResponse.json({ users });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "user with id" + id + " deleted" },
    { status: 200 }
  );
}
