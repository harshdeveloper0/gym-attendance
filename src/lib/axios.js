import axios from "axios";

const api = axios.create({
  baseURL: "/api", // adjust if needed
});

export default api;