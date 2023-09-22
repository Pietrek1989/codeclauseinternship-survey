export const copyLinkToClipboard = (surveyId) => {
  const link = `${window.location.origin}/survey/${surveyId}`;
  navigator.clipboard
    .writeText(link)
    .then(() => {
      alert("Link copied to clipboard");
    })
    .catch((err) => {
      alert("Could not copy link");
    });
};
