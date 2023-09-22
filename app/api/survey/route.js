import connectMongoDB from "@/libs/mongodb";
import Survey from "@/models/survey";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { title, description, questions, ownerId } = await request.json();
    await connectMongoDB();

    const newSurvey = await Survey.create({
      title,
      description,
      questions,
      ownerId,
    });

    const user = await User.findById(ownerId);
    if (user) {
      user.surveys = [...user.surveys, newSurvey._id];
      await user.save();
    } else {
      console.log("User not found: ", ownerId);
      return NextResponse.json(
        { message: "User not found", ownerId },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Survey Created", surveyId: newSurvey._id },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { message: "An error occurred when trying to create a survey" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const id = request.nextUrl.searchParams.get("id");
  const { title, description, questions } = await request.json();
  await connectMongoDB();

  await Survey.findByIdAndUpdate(id, { title, description, questions });

  return NextResponse.json({ message: "Survey Updated" }, { status: 200 });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  await Survey.findByIdAndDelete(id);

  return NextResponse.json({ message: "Survey Deleted" }, { status: 200 });
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const survey = await Survey.findById(id);

  return NextResponse.json({ survey });
}
