import connectMongoDB from "@/libs/mongodb";
import Survey from "@/models/survey";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    title: title,
    description: description,
    questions: questions,
  } = await request.json();
  await connectMongoDB();
  await Survey.findByIdAndUpdate(id, { title, description, questions });
  return NextResponse.json(
    {
      message: "Survey updated ",
    },
    { status: 200 }
  );
}

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const survey = await Survey.findOne({ _id: id });
  return NextResponse.json({ survey }, { status: 200 });
}
