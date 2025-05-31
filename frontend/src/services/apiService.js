import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Request Interceptor: To add the JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Get auth store instance inside the interceptor
    const token = authStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response; // Pass through successful responses
  },
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      console.error("API responded with 401 Unauthorized. Logging out.");
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

// --- Authentication API Calls ---
export const loginUser = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const registerUser = (userData) => {
  return apiClient.post("/auth/register", userData);
};

// --- Charging Station API Calls ---
export const fetchStations = () => {
  return apiClient.get("/stations");
};

export const fetchStationById = (id) => {
  return apiClient.get(`/stations/${id}`);
};

export const createStation = (stationData) => {
  return apiClient.post("/stations", stationData);
};

export const updateStation = (id, stationData) => {
  return apiClient.put(`/stations/${id}`, stationData);
};

export const deleteStation = (id) => {
  return apiClient.delete(`/stations/${id}`);
};
