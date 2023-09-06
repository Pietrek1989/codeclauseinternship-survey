import mongoose, { Schema } from "mongoose";

const surveySchema = new Schema(
  {
    title: String,
    questions: [
      {
        question: String,
        options: [String],
      },
    ],
    responses: [
      {
        age: Number,
        country: String,
        answers: [Number],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model.Survey || mongoose.model("Survey", surveySchema);

export default Survey;
