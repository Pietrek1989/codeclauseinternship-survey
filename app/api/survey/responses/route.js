import connectMongoDB from "@/libs/mongodb";
import Survey from "@/models/survey";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const body = await req.json();
    console.log("body", body);

    if (!body || !body.newResponses) {
      return NextResponse.json(
        { message: "Invalid body or newResponses missing" },
        { status: 400 }
      );
    }

    const { newResponses } = body;

    console.log("newResponses just before the error", newResponses);

    if (!newResponses.age || !newResponses.country || !newResponses.answers) {
      return NextResponse.json(
        { message: "Incomplete newResponses object" },
        { status: 400 }
      );
    }

    const id = req.nextUrl.searchParams.get("id");
    console.log("id", id);

    await connectMongoDB();

    const survey = await Survey.findByIdAndUpdate(
      id,
      {
        $push: {
          responses: newResponses,
        },
      },
      {
        new: true, // This ensures that the updated document is returned
      }
    );

    if (survey) {
      return NextResponse.json({ survey });
    } else {
      return NextResponse.json(
        { message: "Survey not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred when trying to register a form result" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const survey = await Survey.findById(id).populate("responses");

  return NextResponse.json({ survey });
}
