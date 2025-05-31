<template>
  <div class="auth-page">
    <div class="auth-container card">
      <div class="auth-header">
        <h2>Create Account</h2>
        <p>Join EV Charger Hub and start managing your stations</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Create a password (min. 6 characters)"
            required
            minlength="6"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-control"
            placeholder="Confirm your password"
            required
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-full"
          :disabled="isLoading"
        >
          <LoadingSpinner
            v-if="isLoading"
            size="small"
            color="white"
            thickness="thin"
            class="button-spinner"
          />
          <span v-if="isLoading">Creating Account...</span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>
          Already have an account?
          <router-link to="/login" class="auth-link">Sign in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "vue-toastification";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const toast = useToast();
const authStore = useAuthStore();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }
  if (password.value.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return;
  }
  if (!email.value) {
    toast.error("Please enter your email address.");
    return;
  }

  isLoading.value = true;
  try {
    const success = await authStore.register({
      email: email.value,
      password: password.value,
    });

    if (!success) {
      toast.error(authStore.error || "Registration failed. Please try again.");
    } else {
      toast.success("Account created successfully! Logging you in...");
    }
  } catch (error) {
    toast.error("An unexpected error occurred during registration.");
    console.error("Register component error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 60px);
  background-color: var(--color-light-gray, #f8f9fa);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg, 24px);
}
.auth-container.card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-xl, 32px);
  background-color: var(--color-white, #fff);
  border-radius: var(--border-radius-lg, 8px);
  box-shadow: var(--shadow-soft, 0 2px 8px rgba(0, 0, 0, 0.075));
  border: 1px solid var(--color-border, #dee2e6);
}
.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-lg, 24px);
}
.auth-header h2 {
  color: var(--color-dark-text, #212529);
  margin-bottom: var(--spacing-sm, 8px);
  font-size: 1.75rem;
  font-weight: 600;
}
.auth-header p {
  color: var(--color-medium-text, #495057);
  font-size: 0.95rem;
}
.auth-form {
  margin-bottom: var(--spacing-lg, 24px);
}
.form-group {
  margin-bottom: var(--spacing-md, 16px);
}
.form-label {
  display: block;
  margin-bottom: var(--spacing-xs, 4px);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-medium-text, #495057);
}
.form-control {
  display: block;
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-dark-text, #212529);
  background-color: var(--color-white, #fff);
  border: 1px solid var(--color-border-input, #ced4da);
  border-radius: var(--border-radius-md, 0.25rem);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.form-control:focus {
  border-color: var(--color-border-focus, #86b7fe);
  outline: 0;
  box-shadow: var(--box-shadow-focus, 0 0 0 0.25rem rgba(13, 110, 253, 0.25));
}
.btn-full {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.button-spinner {
  margin-right: var(--spacing-sm, 8px);
}
.auth-footer {
  text-align: center;
  padding-top: var(--spacing-md, 16px);
  border-top: 1px solid var(--color-border, #dee2e6);
}
.auth-footer p {
  color: var(--color-medium-text, #495057);
  font-size: 0.9rem;
}
.auth-link {
  color: var(--color-primary, #007bff);
  font-weight: 500;
  text-decoration: none;
}
.auth-link:hover {
  color: var(--color-primary-hover, #0056b3);
  text-decoration: underline;
}
</style>
