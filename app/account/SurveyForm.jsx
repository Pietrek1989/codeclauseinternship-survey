"use client";
import React, { useEffect, useState } from "react";

const SurveyForm = ({ surveyId }) => {
  const [questions, setQuestions] = useState([{ question: "", options: [""] }]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (surveyId) {
      // Fetch existing survey data and populate the form
      fetch(`/api/surveys/${surveyId}`)
        .then((response) => response.json())
        .then((data) => {
          setTitle(data.survey.title);
          setDescription(data.survey.description);
          setQuestions(data.survey.questions);
        })
        .catch((error) => console.error("Error fetching survey: ", error));
    }
  }, [surveyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      questions,
    };

    try {
      let response;
      if (surveyId) {
        response = await fetch(`/api/surveys/edit?id=${surveyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/surveys/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        console.log("Survey saved successfully!");
      } else {
        console.log("Failed to save survey.");
      }
    } catch (error) {
      console.error("An error occurred while saving the survey", error);
    }
  };
  return (
    <div>
      <h2 className="text-center mb-5">
        {surveyId ? "Edit Survey" : "New Survey"}
      </h2>
      <form className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {questions.map((q, qIndex) => (
          <div key={qIndex}>
            <label htmlFor={`question-${qIndex}`} className="p-1">
              Question #{qIndex + 1}
            </label>
            <textarea
              id={`question-${qIndex}`}
              type="text"
              className=" question "
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[qIndex].question = e.target.value;
                setQuestions(newQuestions);
              }}
            />
            <div>
              {q.options.map((option, oIndex) => (
                <div key={oIndex}>
                  <label htmlFor={`option-${qIndex}-${oIndex}`} className="p-1">
                    Option #{oIndex + 1}
                  </label>
                  <textarea
                    id={`option-${qIndex}-${oIndex}`}
                    type="text"
                    className="rounded-sm border "
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    disabled={q.options.length >= 6}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[qIndex].options[oIndex] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                </div>
              ))}
              {q.options.length < 6 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const newQuestions = [...questions];
                    newQuestions[qIndex].options.push("");
                    setQuestions(newQuestions);
                  }}
                >
                  Add Another Option
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn-primary my-5"
          onClick={() => {
            setQuestions([...questions, { question: "", options: [""] }]);
          }}
        >
          Add Another Question
        </button>
        <button type="submit" className="btn-primary my-5">
          Save Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
