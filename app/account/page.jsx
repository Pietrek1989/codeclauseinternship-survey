"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

const AccountPage = () => {
  const { data: session } = useSession();
  const [activeComponent, setActiveComponent] = useState("hello");
  const [questions, setQuestions] = useState([{ question: "", options: [""] }]);

  const renderComponent = () => {
    if (activeComponent === "createSurvey") {
      return (
        <div>
          <h3>Create a New Survey</h3>
          <form>
            {questions.map((q, qIndex) => (
              <div key={qIndex}>
                <label htmlFor={`question-${qIndex}`}>
                  Question {qIndex + 1}
                </label>
                <textarea
                  id={`question-${qIndex}`}
                  type="text"
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
                      <label htmlFor={`option-${qIndex}-${oIndex}`}>
                        Option {oIndex + 1}
                      </label>
                      <textarea
                        id={`option-${qIndex}-${oIndex}`}
                        type="text"
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
              onClick={() => {
                setQuestions([...questions, { question: "", options: [""] }]);
              }}
            >
              Add Another Question
            </button>
          </form>
        </div>
      );
    } else {
      return <div>Hello, {session?.user?.name}</div>;
    }
  };

  return (
    <section className="flex flex-col sm:flex-row ">
      <div className="sm:w-2/12 w-full p-4">
        <div className="mb-4">
          <button
            onClick={() => setActiveComponent("createSurvey")}
            className="bg-primary text-white font-bold py-2 px-4 rounded"
          >
            Create New Survey
          </button>
        </div>
      </div>
      <div className="sm:w-10/12 w-full p-4">{renderComponent()}</div>
    </section>
  );
};

export default AccountPage;

// const getSurvey = async () => {
//   try {
//     const res = await fetch("https://localhost:3000/api/surveys", {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw newError("Failed to fetch surveys");
//     }
//     return res.json();
//   } catch (error) {
//     console.log(error);
//   }
