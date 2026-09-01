import api from "./api";

export const getDashboardData = async () => {
  return await api("/dashboard", {
    method: "GET",
  });
};