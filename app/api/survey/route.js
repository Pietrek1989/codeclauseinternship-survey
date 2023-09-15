import connectMongoDB from "@/libs/mongodb";
import Survey from "@/models/survey";

export async function createSurvey(request) {
  try {
    const { title, description, questions, ownerId } = await request.json();
    await connectMongoDB();

    const newSurvey = await Survey.create({
      title,
      description,
      questions,
      ownerId,
    });

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

export async function editSurvey(request) {
  const id = request.nextUrl.searchParams.get("id");
  const { title, description, questions } = await request.json();
  await connectMongoDB();

  await Survey.findByIdAndUpdate(id, { title, description, questions });

  return NextResponse.json({ message: "Survey Updated" }, { status: 200 });
}

export async function deleteSurvey(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  await Survey.findByIdAndDelete(id);

  return NextResponse.json({ message: "Survey Deleted" }, { status: 200 });
}

export async function getSurveyResults(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const survey = await Survey.findById(id).populate("responses");

  return NextResponse.json({ survey });
}
