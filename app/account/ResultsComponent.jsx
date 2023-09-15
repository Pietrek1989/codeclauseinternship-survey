import { useEffect, useState } from "react";

const ResultsComponent = ({ surveyId }) => {
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    fetch(`/api/surveys/${surveyId}`)
      .then((response) => response.json())
      .then((data) => {
        setSurvey(data.survey);
      })
      .catch((error) => {
        console.error("Error fetching survey results: ", error);
      });
  }, [surveyId]);

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{survey.title}</h1>
      {/* Render the survey results here */}
    </div>
  );
};

export default ResultsComponent;
