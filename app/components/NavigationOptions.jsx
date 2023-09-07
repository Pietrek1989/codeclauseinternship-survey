"use client";
import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";

const NavigationOptions = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.name ? (
        <Link href={"/account"}>Your Surveys</Link>
      ) : (
        <Link href={"/login"}>Log in</Link>
      )}

      {session?.user?.name && (
        <span
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <Link href={"/"}>Sign Out</Link>
        </span>
      )}
    </>
  );
};

export default NavigationOptions;
