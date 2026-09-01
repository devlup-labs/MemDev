import api from "./api";

export const login = async (email, password) => {
  return await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const signup = async (username, email, password) => {
  return await api("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};