import Link from "next/link";
import React from "react";

const Account = async () => {
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
  //   const { surveys } = await getSurvey();
  return (
    <div>
      <Link href={"/account/createSurvey"}>
        <button>New</button>
      </Link>
      {/* {surveys.map((survey) => {
        <Link href={`/${survey._id}`}>{survey.name}</Link>;
      })} */}
      ;
    </div>
  );
};
export default Account;
