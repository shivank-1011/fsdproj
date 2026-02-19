import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // You can add logic here if you need to attach headers dynamically
    // For example, if you were storing tokens in localStorage (not recommended for HttpOnly cookies)
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        // We assume the refresh token is stored in an HttpOnly cookie
        await api.post("/auth/refresh-token");

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, user needs to login again
        // We can redirect to login or let the app handle the 401
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
