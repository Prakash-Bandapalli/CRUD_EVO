<template>
  <nav class="app-navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-text">EV Charger</span>
          <span class="brand-accent">Hub</span>
        </router-link>
      </div>

      <div class="navbar-menu">
        <template v-if="authStore.isAuthenticated && authStore.currentUser">
          <router-link to="/chargers" class="nav-link"> Stations </router-link>
          <div class="user-section">
            <span class="user-greeting">
              Hi,
              <span class="username">{{
                authStore.currentUser.email.split("@")[0]
              }}</span>
            </span>
            <button
              @click="handleLogout"
              class="btn btn-outline-secondary btn-sm"
            >
              Logout
            </button>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link"> Login </router-link>
          <router-link to="/register" class="btn btn-primary">
            Get Started
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "vue-toastification";

const authStore = useAuthStore();
const toast = useToast();

const handleLogout = () => {
  authStore.logout();
  toast.info("You have been logged out.");
};
</script>

<style scoped>
.app-navbar {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  height: 70px;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: var(--shadow-soft);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-dark-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.brand-link:hover {
  text-decoration: none;
  color: var(--color-dark-text);
}

.brand-text {
  color: var(--color-dark-text);
}

.brand-accent {
  color: var(--color-primary);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.nav-link {
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--color-medium-text);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: color 0.15s ease-in-out;
  border-radius: var(--border-radius-md);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--color-primary);
  text-decoration: none;
  background-color: rgba(0, 123, 255, 0.05);
}

.nav-link.router-link-exact-active {
  color: var(--color-primary);
  background-color: rgba(0, 123, 255, 0.1);
  font-weight: 600;
}

.user-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding-left: var(--spacing-md);
  border-left: 1px solid var(--color-border);
}

.user-greeting {
  font-size: 0.9rem;
  color: var(--color-medium-text);
  font-weight: 500;
}

.username {
  color: var(--color-secondary);
  font-weight: 600;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .app-navbar {
    padding: 0 var(--spacing-md);
  }

  .navbar-menu {
    gap: var(--spacing-md);
  }

  .user-section {
    flex-direction: column;
    gap: var(--spacing-xs);
    padding-left: var(--spacing-sm);
  }

  .user-greeting {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .brand-link {
    font-size: 1.3rem;
  }

  .nav-link {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.9rem;
  }
}
</style>
