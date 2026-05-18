
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://armored-zebra-accustom.ngrok-free.dev/api";

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

export default API;
