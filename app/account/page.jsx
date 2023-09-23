"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SurveyForm from "./SurveyForm";
import ResultsComponent from "./ResultsComponent";
import { getSurvey } from "../fetching";
import { copyLinkToClipboard } from "./functions";

const AccountPage = () => {
  const { data: session } = useSession();

  const [activeComponent, setActiveComponent] = useState("hello");
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getSurvey(session.user);
      console.log("session", session.user);
      console.log("Received data: ", data);
      if (data && data.user) {
        setSurveys(data);
        console.log("surveys", surveys);
      }
    }
    fetchData();
  }, [session]);

  const renderComponent = () => {
    console.log(surveys?.user?._id);
    if (activeComponent === "createSurvey") {
      return <SurveyForm userId={surveys?.user?._id} setSurveys={setSurveys} />;
    } else if (activeComponent.startsWith("editSurvey:")) {
      const surveyId = activeComponent.split(":")[1];
      return <SurveyForm surveyId={surveyId} userId={surveys?.user?._id} />;
    } else if (activeComponent.startsWith("viewResults:")) {
      const surveyId = activeComponent.split(":")[1];
      return <ResultsComponent surveyId={surveyId} />;
    } else {
      return (
        <>
          <ul>
            <div>Hello, {session?.user?.name}</div>
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
          {surveys?.user?.surveys?.map((survey) => (
            <li key={survey._id}>
              <button
                onClick={() =>
                  setActiveSurvey((prev) =>
                    prev === survey._id ? null : survey._id
                  )
                }
              >
                {survey.title}
              </button>

              <div
                className={`slide-down ${
                  activeSurvey === survey._id ? "show" : ""
                }`}
              >
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
                <button onClick={() => copyLinkToClipboard(survey._id)}>
                  Copy Survey Link
                </button>
              </div>
            </li>
          ))}
        </div>
      </div>

      <div className="w-full">{renderComponent()}</div>
    </section>
  );
};

export default AccountPage;
