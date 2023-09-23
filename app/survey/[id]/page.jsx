"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const SurveyPage = ({ params }) => {
  const id = params.id;
  console.log("Inside [id].jsx");
  const [survey, setSurvey] = useState({ questions: [] });
  const [response, setResponse] = useState({
    age: null,
    country: "",
    gender: "",
    answers: [],
  });
  const [loading, setLoading] = useState(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setResponse({
      ...response,
      [name]: value,
    });
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    const newAnswers = [...response.answers];
    const answerIndex = newAnswers.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (answerIndex !== -1) {
      newAnswers[answerIndex].selectedOption = selectedOption;
    } else {
      newAnswers.push({ questionId, selectedOption });
    }

    setResponse({
      ...response,
      answers: newAnswers,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/responses/${id}`, {
        responses: response,
      });
      alert("response saved");
      // Handle successful submission here
    } catch (error) {
      // Handle error here
      console.error("Error submitting survey", error);
    }
  };

  useEffect(() => {
    // Fetch the survey data by its ID when the component mounts
    // This part is just for demonstration. You'll have to replace this with your actual fetching logic.
    axios
      .get(`/api/survey/${id}`)
      .then((res) => {
        setSurvey(res.data);
        setLoading(false); // set loading to false after data is fetched
      })
      .catch((error) => console.error("Error fetching survey", error));
  }, []);
  console.log("id her", id);
  console.log("survey data", survey);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="mx-10">
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          onChange={handleInputChange}
          required
        />
        <div className="flex flex-col">
          {survey?.survey?.questions?.map((q, index) => (
            <div key={q._id}>
              <label>{q.question}</label>
              <div className="flex flex-col">
                {q.options.map((option, optionIndex) => (
                  <div className="flex " key={optionIndex}>
                    {" "}
                    <input
                      type="radio"
                      value={option}
                      name={`question-${index}`}
                      onChange={() => handleAnswerChange(q._id, option)}
                      required
                    />
                    <span className="ml-2">{option}</span>{" "}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyPage;
