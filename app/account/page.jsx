"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AccountPage = () => {
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
  // };
  const { data: session } = useSession();
  //   const { surveys } = await getSurvey();
  return (
    <section className="flex flex-col sm:flex-row w-screen">
      <div className="sm:w-2/12 w-full"> the icons etc </div>
      <div className="sm:w-10/12 w-full">
        <h2>Hello {session?.user?.name}</h2>
        <Link href={"/Page/createSurvey"}>
          <button>New</button>
        </Link>
        {/* {surveys.map((survey) => {
        <Link href={`/${survey._id}`}>{survey.name}</Link>;
      })} */}
        ;
      </div>
    </section>
  );
};
export default AccountPage;
