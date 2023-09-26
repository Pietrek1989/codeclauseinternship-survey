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
    setAggregatedData(aggregateResponses(data.survey));
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

  const toggleChartType = () => {
    setChartType(chartType === "bar" ? "pie" : "bar");
  };

  useEffect(() => {
    if (survey) {
      const newAggregatedData = aggregateResponses(survey);
      setAggregatedData(newAggregatedData);
    }
  }, [survey, minAge, maxAge, genderFilter, countryFilter]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Add more colors if you have more bars or pie sections

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
    <div>
      <h1 className="text-center my-5">{survey.title}</h1>
      {/* Filters */}
      <div>
        <label>
          Age:
          <input
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
      <button onClick={toggleChartType}>Toggle Chart Type</button>

      {survey.questions.map((question) => {
        const dataForQuestion = Object.entries(
          aggregatedData[question._id] || {}
        ).map(([key, value]) => ({
          name: key,
          count: value,
        }));

        return (
          <div key={question._id}>
            <h3>{question.question}</h3>
            {renderChart(question, dataForQuestion)}
          </div>
        );
      })}
    </div>
  );
};

export default ResultsComponent;
