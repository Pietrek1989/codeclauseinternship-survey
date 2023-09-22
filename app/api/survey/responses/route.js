import connectMongoDB from "@/libs/mongodb";
import Survey from "@/models/survey";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { id } = req.query;

    const { responses: newResponses } = body;

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
      res.status(200).json({ survey });
    } else {
      res.status(404).json({ message: "Survey not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const survey = await Survey.findById(id).populate("responses");

  return NextResponse.json({ survey });
}
