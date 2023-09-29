import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen  p-0 m-0 hero-page relative ">
      <div className="flex flex-col h-20 justify-center items-center mr-0 pr-0 pt-5">
        <h1>Welcome to SpeedSurvey</h1>
        <h2>Easy and Speedy to create, share and analyze your surveys!</h2>
      </div>
      <div className="flex h-screen w-100 justify-center items-center">
        <Link href="/login">
          <button className=" bg-blue rounded-md text-lg  bg-primary text-fourth">
            Create your survey!
          </button>
        </Link>
      </div>
    </main>
  );
}
