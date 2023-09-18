export const getSurvey = async ({ email, name }) => {
  try {
    const res = await fetch("http://localhost:3000/api/survey/byuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch surveys");
    }

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
