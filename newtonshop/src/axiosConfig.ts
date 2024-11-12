import axios from "axios";
import { TokenDto } from "./types";

const BASE_URL = "http://localhost:9000/api/v1";

const refreshTokens = async (): Promise<TokenDto> => {
  const response = await axios.post<TokenDto>(
    `${BASE_URL}/users/refresh-token`,
    {},
    {
      withCredentials: true,
    }
  );
  const newTokens = response.data;

  localStorage.setItem("accessToken", newTokens.accessToken);

  return newTokens;
};

const redirectToLogin = () => {
  window.location.href = "/auth";
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshTokens();
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
