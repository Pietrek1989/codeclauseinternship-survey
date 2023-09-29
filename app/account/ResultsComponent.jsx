import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dummySurveyData } from "./dummySurveyData"; // Import dummy data

const ResultsComponent = ({ surveyId }) => {
  const [survey, setSurvey] = useState(null);
  const [aggregatedData, setAggregatedData] = useState(null);
  const [chartType, setChartType] = useState("bar"); // 'bar' or 'pie'
  const [ageFilter, setAgeFilter] = useState(null);
  const [genderFilter, setGenderFilter] = useState(null);
  const [countryFilter, setCountryFilter] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [totalResponses, setTotalResponses] = useState(0);
  const [countryCount, setCountryCount] = useState({});
  const [genderCount, setGenderCount] = useState({});
  const [ageDemographics, setAgeDemographics] = useState({});

  // useEffect(() => {
  //   fetch(`/api/survey/responses?id=${surveyId}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSurvey(data.survey);

  //       // Create a set of unique countries
  //       const countries = new Set();
  //       data.survey.responses.forEach((response) => {
  //         countries.add(response.country);
  //       });

  //       setAvailableCountries(Array.from(countries));
  //       setAggregatedData(aggregateResponses(data.survey));
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching survey results:", error);
  //     });
  // }, [surveyId]);

  useEffect(() => {
    // Instead of fetch, we set dummy data directly
    const data = dummySurveyData;
    setSurvey(data.survey);
    const countries = new Set();
    data.survey.responses.forEach((response) => {
      countries.add(response.country);
    });
    setAvailableCountries(Array.from(countries));
    const aggregated = aggregateResponses(data.survey);
    setAggregatedData(aggregated);
    const analysis = analyzeSurveyData(data.survey.responses);
    setTotalResponses(analysis.totalResponses);
    setCountryCount(analysis.countryCount);
    setGenderCount(analysis.genderCount);
    setAgeDemographics(analysis.ageDemographics);
  }, [surveyId]);

  const aggregateResponses = (survey) => {
    const aggregate = {};

    survey.responses.forEach((response) => {
      if (
        (minAge === "" || response.age >= parseInt(minAge)) &&
        (maxAge === "" || response.age <= parseInt(maxAge)) &&
        (!countryFilter || response.country === countryFilter) &&
        (!genderFilter || response.gender === genderFilter)
      ) {
        response.answers.forEach((answer) => {
          const { questionId, selectedOption } = answer;

          if (!aggregate[questionId]) {
            aggregate[questionId] = {};
          }

          if (!aggregate[questionId][selectedOption]) {
            aggregate[questionId][selectedOption] = 0;
          }

          aggregate[questionId][selectedOption]++;
        });
      }
    });

    return aggregate;
  };

  const analyzeSurveyData = (responses) => {
    const totalResponses = responses.length;

    const countryCount = {};
    const genderCount = { Male: 0, Female: 0 };
    const ageDemographics = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55+": 0,
    };

    responses.forEach((response) => {
      countryCount[response.country] =
        (countryCount[response.country] || 0) + 1;
      genderCount[response.gender]++;

      const age = response.age;
      if (age >= 18 && age <= 24) ageDemographics["18-24"]++;
      else if (age >= 25 && age <= 34) ageDemographics["25-34"]++;
      else if (age >= 35 && age <= 44) ageDemographics["35-44"]++;
      else if (age >= 45 && age <= 54) ageDemographics["45-54"]++;
      else ageDemographics["55+"]++;
    });

    return { totalResponses, countryCount, genderCount, ageDemographics };
  };

  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "pie" : "bar");
  };

  useEffect(() => {
    if (survey) {
      const newAggregatedData = aggregateResponses(survey);
      setAggregatedData(newAggregatedData);
    }
  }, [survey, minAge, maxAge, genderFilter, countryFilter]);

  const COLORS = ["#a39a93", "#E9DBD2", "#d2e4e9", "#8798AD"]; // Add more colors if you have more bars or pie sections

  const renderChart = (question, dataForQuestion) => {
    const totalResponses = dataForQuestion.reduce(
      (sum, item) => sum + item.count,
      0
    );

    if (chartType === "bar") {
      return (
        <BarChart
          width={500}
          height={300}
          data={dataForQuestion}
          margin={{
            top: 30, // Added 30px margin at the top
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count">
            {dataForQuestion.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              className="mt-10"
              formatter={(count) =>
                `${((count / totalResponses) * 100).toFixed(1)}%`
              }
            />
          </Bar>
        </BarChart>
      );
    }

    if (chartType === "pie") {
      return (
        <PieChart width={400} height={400}>
          <Pie
            data={dataForQuestion}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) =>
              `${((entry.count / totalResponses) * 100).toFixed(1)}%`
            }
          >
            {dataForQuestion.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }
  };

  if (!survey || !aggregatedData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-center my-5">NAME: {survey.title}</h1>
      {/* Filters */}

      <div className="form w-full ">
        <h2>Survey Summary:</h2>
        <p className="text-xl">Total Responses: {totalResponses}</p>
        <div className="flex justify-around mt-5 flex-wrap">
          <div className=" result-details rounded-md mx-5 p-2">
            <h3 className="text-lg font-bold">By Country:</h3>
            <ul>
              {Object.entries(countryCount).map(([country, count]) => (
                <li key={country} className="my-1 flex justify-between">
                  <span className="font-bold">{country}</span> {count}
                </li>
              ))}
            </ul>
          </div>
          <div className="result-details rounded-md mx-5 p-2">
            <h3 className="text-lg font-bold">By Gender:</h3>
            <ul>
              <li key={genderCount} className="my-1 flex justify-between">
                <span className="font-bold">Male</span> {genderCount.Male}
              </li>
              <li className="my-1 flex justify-between">
                <span className="font-bold">Female</span> {genderCount.Female}
              </li>
            </ul>
          </div>
          <div className="result-details rounded-md mx-5 p-2">
            <h3 className="text-lg font-bold">By Age:</h3>
            <ul>
              {Object.entries(ageDemographics).map(([ageRange, count]) => (
                <li key={ageRange} className="my-1 flex justify-between">
                  <span className="font-bold">{ageRange}</span> {count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div>
          <h2>FILTERS:</h2>
          <label>
            Age:{" "}
            <input
              className="mx-5"
              type="number"
              placeholder="Min Age"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Age"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
            />
          </label>
          <br />
          <label>
            Gender:
            <select onChange={(e) => setGenderFilter(e.target.value)}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>
            Country:
            <select onChange={(e) => setCountryFilter(e.target.value)}>
              <option value="">All</option>
              {availableCountries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="btn-secondary mt-5" onClick={toggleChartType}>
          Toggle Chart Type
        </button>
      </div>

      {survey.questions.map((question, i) => {
        const dataForQuestion = Object.entries(
          aggregatedData[question._id] || {}
        ).map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return (
          <div key={question._id} className="form">
            <h2>
              Q#{i + 1} {question.question}
            </h2>
            <div className="mx-auto flex justify-center mt-5">
              {renderChart(question, dataForQuestion)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ResultsComponent;
