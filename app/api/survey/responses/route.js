export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();

  const survey = await Survey.findById(id).populate("responses");

  return NextResponse.json({ survey });
}
