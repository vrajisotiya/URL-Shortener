import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data.data.user;
};

export const registerUser = async (name, email, password) => {
  const { data } = await axiosInstance.post("/auth/login", {
    name,
    email,
    password,
  });
  return data.data.user;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.get("/auth/logout");
  return data.data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/current-user");
  return data.data;
};

export const userAllUrls = async () => {
  const { data } = await axiosInstance.get("/user/urls");

  return data.data;
};
