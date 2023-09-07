"use client";
import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";

const NavigationOptions = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-end">
      {session?.user ? (
        <Link href={"/account"}>Your Surveys</Link>
      ) : (
        <Link href={"/login"}>Log in</Link>
      )}

      {session?.user && (
        <span
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <Link href={"/"}>Sign Out</Link>
        </span>
      )}
    </div>
  );
};

export default NavigationOptions;
