import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ChargerListView from "../views/ChargerListView.vue";
import AddChargerStationView from "../views/AddChargerStationView.vue";
import EditChargerStationView from "../views/EditChargerStationView.vue";

import { useAuthStore } from "@/stores/authStore";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: { requiresGuest: true }, // Only accessible if not logged in
  },
  {
    path: "/chargers",
    name: "chargers",
    component: ChargerListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/chargers/add",
    name: "add-charger",
    component: AddChargerStationView,
    meta: { requiresAuth: true }, // This route also requires authentication
  },
  {
    path: "/chargers/edit/:id", // :id is a route parameter
    name: "edit-charger",
    component: EditChargerStationView,
    meta: { requiresAuth: true },
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard (should already be there)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: "chargers" });
  } else {
    next();
  }
});

export default router;
