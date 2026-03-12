const baseURL = "http://localhost:8000/api";
const retrieveOrdersDataPath = "/order";

export const retrieveOrdersData = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    window.location.href = "./login.html";
    return;
  }
  const res = await fetch(`${baseURL}${retrieveOrdersDataPath}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    return console.error(error.details.errorMessage);
  }

  return await res.json();
};
