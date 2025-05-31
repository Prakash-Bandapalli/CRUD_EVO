import { defineStore } from "pinia";
import {
  loginUser as apiLoginUser,
  registerUser as apiRegisterUser,
} from "@/services/apiService";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("authUser")) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await apiLoginUser(credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        // Persist to localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        router.push("/chargers");
        return true;
      } catch (error) {
        console.error(
          "Login failed:",
          error.response?.data?.error || error.message
        );

        return false;
      }
    },

    async register(userData) {
      try {
        const response = await apiRegisterUser(userData);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));

        router.push("/chargers");
        return true;
      } catch (error) {
        console.error(
          "Registration failed:",
          error.response?.data?.error || error.message
        );

        return false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      // Redirect to login page
      router.push("/login");
    },
  },
});
