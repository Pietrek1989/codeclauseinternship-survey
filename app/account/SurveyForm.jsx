"use client";
import React, { useEffect, useState } from "react";
import { getSurvey } from "../fetching";
import { useSession } from "next-auth/react";

const SurveyForm = ({ surveyId, userId, setSurveys }) => {
  const [questions, setQuestions] = useState([{ question: "", options: [""] }]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    console.log("userid", userId);
    if (surveyId) {
      // Fetch existing survey data and populate the form
      fetch(`http://localhost:3000/api/survey/${surveyId}`)
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
      ownerId: userId,
    };
    console.log("payload", payload);

    try {
      let response;
      let url;
      let method;

      if (surveyId) {
        url = `/api/survey/${surveyId}`;
        method = "PUT";
      } else {
        url = `/api/survey`;
        method = "POST";
      }

      response = await fetch(`http://localhost:3000${url}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const userData = await getSurvey(session.user);
      if (userData && userData.user) {
        setSurveys(userData);
        console.log("surveys", surveys);
      }

      console.log("data", data);
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
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn-primary my-5"
        >
          Save Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
