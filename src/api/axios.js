
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("user");
      window.location.assign("/");
    }

    return Promise.reject(error);
  }
);

export default API;



// import axios from "axios";

// const API_BASE_URL =
//   "https://my-project-backend-aekp.onrender.com/api";

// const API = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// API.interceptors.request.use((req) => {
//   const storedUser = localStorage.getItem("user");

//   if (storedUser) {
//     const user = JSON.parse(storedUser);

//     if (user?.token) {
//       req.headers.Authorization = `Bearer ${user.token}`;
//     }
//   }

//   return req;
// });

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isLoginRequest =
//       error.config?.url?.includes("/auth/login");

//     if (error.response?.status === 401 && !isLoginRequest) {
//       localStorage.removeItem("user");
//       window.location.assign("/");
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;
