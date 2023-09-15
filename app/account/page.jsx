"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SurveyForm from "./SurveyForm";
import ResultsComponent from "./ResultsComponent";

const AccountPage = () => {
  const { data: session } = useSession();
  const [activeComponent, setActiveComponent] = useState("hello");
  const [surveys, setSurveys] = useState([]);

  const getSurvey = async () => {
    try {
      const res = await fetch("https://localhost:3000/api/surveys", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw newError("Failed to fetch surveys");
      }
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const data = getSurvey();
    console.log(data);
    setSurveys(data.surveys);
  }, []);

  const renderComponent = () => {
    if (activeComponent === "createSurvey") {
      return <SurveyForm />;
    } else if (activeComponent.startsWith("editSurvey:")) {
      const surveyId = activeComponent.split(":")[1];
      return <SurveyForm surveyId={surveyId} />;
    } else if (activeComponent.startsWith("viewResults:")) {
      const surveyId = activeComponent.split(":")[1];
      return <ResultsComponent surveyId={surveyId} />;
    } else {
      return (
        <>
          <div>Hello, {session?.user?.name}</div>
          <ul>
            {surveys?.map((survey) => (
              <li key={survey._id}>
                {survey.title}
                <button
                  onClick={() => setActiveComponent(`editSurvey:${survey._id}`)}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setActiveComponent(`viewResults:${survey._id}`)
                  }
                >
                  View Results
                </button>
              </li>
            ))}
          </ul>
        </>
      );
    }
  };

  return (
    <section className="flex flex-col sm:flex-row">
      <div className="sm:w-2/12 w-full p-4">
        <div className="mb-4">
          <button
            onClick={() => setActiveComponent("createSurvey")}
            className="btn-primary  py-2 px-4 rounded"
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
