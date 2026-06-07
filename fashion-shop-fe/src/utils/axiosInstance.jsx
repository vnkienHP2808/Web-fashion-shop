import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Tự động gắn accessToken vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tự động refresh khi accessToken hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // Hết hạn hoàn toàn → đăng xuất
        localStorage.clear();
        window.location.href = "/sign-in";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://localhost:8080/auth/refresh", { // hết hạn tự động gọi api 
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default api;