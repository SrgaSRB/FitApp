//local  http://localhost:5054/api
//render https://fitapp-5hi9.onrender.com/api

import axios from "axios";

const api = axios.create({
    baseURL: "https://fitapp-5hi9.onrender.com/api", 
    headers: {
        "Content-Type": "application/json",
      }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;