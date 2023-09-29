"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SurveyForm from "./SurveyForm";
import ResultsComponent from "./ResultsComponent";
import { getSurvey } from "../fetching";
import { copyLinkToClipboard } from "./functions";
import {
  VscClose,
  VscCopy,
  VscEdit,
  VscListFlat,
  VscPieChart,
} from "react-icons/vsc";
import { TfiViewList } from "react-icons/tfi";

const AccountPage = () => {
  const { data: session } = useSession();

  const [activeComponent, setActiveComponent] = useState("hello");
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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

  const handleComponentChange = (newComponent) => {
    setActiveComponent(newComponent);
    setIsSidebarVisible(false); // Close the sidebar
  };

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
    <section className="flex flex-col md:flex-row relative">
      {/* Toggle Button */}
      {!isSidebarVisible && (
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className="absolute top-0 left-3 z-50"
        >
          <TfiViewList className="text-primary text-lg" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`p-4 mx-auto w-full md:w-4/12   fixed z-40 left-nav ${
          !isSidebarVisible ? "hidden" : ""
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsSidebarVisible(false)}
          className="absolute top-0 left-1 text-white font-bold text-2xl"
        >
          <VscClose />
        </button>
        <button
          onClick={() => setActiveComponent("createSurvey")}
          className="btn-primary  py-2 mt-5 w-full text-center md:px-8 mb-2 rounded flex justify-center"
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
                  onClick={() => {
                    setIsSidebarVisible(false);

                    setActiveComponent(`editSurvey:${survey._id}`);
                  }}
                  className="underline"
                >
                  <VscEdit />
                  Edit
                </button>
                <button
                  className="underline"
                  onClick={() => {
                    setIsSidebarVisible(false);

                    setActiveComponent(`viewResults:${survey._id}`);
                  }}
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
      <div className="w-full mx-10 md:mx-20">{renderComponent()}</div>
    </section>
  );
};

export default AccountPage;
