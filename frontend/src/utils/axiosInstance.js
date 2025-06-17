import axios from "axios";
import { store } from "../store/store.js";
import { logout } from "../store/slice/authSlice.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
  withCredentials: true,
});

const refreshAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAxios.post("/auth/refresh-token");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject({
      message:
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred",
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default axiosInstance;
