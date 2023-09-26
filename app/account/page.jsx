"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SurveyForm from "./SurveyForm";
import ResultsComponent from "./ResultsComponent";
import { getSurvey } from "../fetching";
import { copyLinkToClipboard } from "./functions";
import { VscCopy, VscEdit, VscListFlat, VscPieChart } from "react-icons/vsc";

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
          <ul className="w-full h-full flex justify-center items-center">
            <h2>Hello, {session?.user?.name}</h2>
          </ul>
        </>
      );
    }
  };

  return (
    <section className="flex flex-col sm:flex-row ">
      <div className="sm:w-3/12 w-full p-4">
        <div className="mb-4  min-h-full left-nav">
          <button
            onClick={() => setActiveComponent("createSurvey")}
            className="btn-primary  py-2 px-8 mb-2 rounded"
          >
            Create New Survey
          </button>
          <div className="ml-2">
            <h5>Your surveys:</h5>
            {surveys?.user?.surveys?.map((survey) => (
              <li key={survey._id}>
                <button
                  onClick={() =>
                    setActiveSurvey((prev) =>
                      prev === survey._id ? null : survey._id
                    )
                  }
                >
                  <VscListFlat />
                  {survey.title}
                </button>

                <div
                  className={`slide-down ml-8 mb-4 ${
                    activeSurvey === survey._id ? "show" : ""
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveComponent(`editSurvey:${survey._id}`)
                    }
                    className="underline"
                  >
                    <VscEdit />
                    Edit
                  </button>
                  <button
                    className="underline"
                    onClick={() =>
                      setActiveComponent(`viewResults:${survey._id}`)
                    }
                  >
                    <VscPieChart /> Results
                  </button>
                  <button
                    className="underline"
                    onClick={() => copyLinkToClipboard(survey._id)}
                  >
                    <VscCopy />
                    Copy Link
                  </button>
                </div>
              </li>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full">{renderComponent()}</div>
    </section>
  );
};

export default AccountPage;
