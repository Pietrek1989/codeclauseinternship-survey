import mongoose, { Schema } from "mongoose";

const surveySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],
    responses: [
      {
        age: { type: String, required: true },
        country: { type: String, required: true },
        gender: { type: String, required: true },
        answers: [
          {
            questionId: { type: String },
            selectedOption: { type: String },
          },
        ],
      },
    ],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.models.Survey || mongoose.model("Survey", surveySchema);

export default Survey;
