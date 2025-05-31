<template>
  <div class="home-container">
    <!-- Enhanced Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">⚡</span>
          <span>Powering the Future of Transportation</span>
        </div>

        <h1 class="hero-title">
          <template v-if="authStore.isAuthenticated && authStore.currentUser">
            Welcome Back,
            <span class="username">{{
              authStore.currentUser.email.split("@")[0]
            }}</span
            >!
          </template>
          <template v-else>
            Power Up <span class="accent-text">Your Journey</span><br />
            <span class="subtitle-text">with Smart EV Charging</span>
          </template>
        </h1>

        <p class="hero-subtitle">
          {{
            authStore.isAuthenticated
              ? "Ready to manage your stations or find the nearest charge?"
              : "The comprehensive platform for discovering, managing, and optimizing EV charging infrastructure across the globe."
          }}
        </p>

        <div class="hero-actions">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/chargers" class="btn btn-primary btn-lg">
              <span class="btn-icon">📍</span>
              View Stations
            </router-link>
          </template>
          <template v-else>
            <router-link to="/register" class="btn btn-primary btn-lg">
              Get Started Free
            </router-link>
            <router-link to="/login" class="btn btn-outline-secondary btn-lg">
              Sign In
            </router-link>
          </template>
        </div>
      </div>

      <div class="hero-visual">
        <div class="charging-station-container">
          <div class="charging-station">
            <div class="station-body">
              <div class="power-indicator"></div>
              <div class="charging-port"></div>
              <div class="station-screen">
                <div class="screen-line"></div>
                <div class="screen-line short"></div>
                <div class="screen-line"></div>
              </div>
            </div>
            <div class="station-base"></div>
          </div>

          <!-- Floating elements for visual interest -->
          <div class="floating-element element-1">
            <span class="element-icon">🔋</span>
            <span class="element-text">Fast Charging</span>
          </div>
          <div class="floating-element element-2">
            <span class="element-icon">🌱</span>
            <span class="element-text">Eco-Friendly</span>
          </div>
          <div class="floating-element element-3">
            <span class="element-icon">📱</span>
            <span class="element-text">Smart Control</span>
          </div>

          <!-- Energy waves animation -->
          <div class="energy-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Features Section - Only for non-authenticated users -->
    <section class="features-section" v-if="!authStore.isAuthenticated">
      <div class="features-container">
        <div class="features-header">
          <h2>Why Choose EV Charger Hub?</h2>
          <p class="section-subtitle">
            Everything you need to power the electric revolution
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">📍</div>
            <h3>Smart Discovery</h3>
            <p>
              Find charging stations with real-time availability, pricing, and
              route optimization powered by AI.
            </p>
            <div class="feature-highlight">Real-time data</div>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">⚙️</div>
            <h3>Station Management</h3>
            <p>
              Effortlessly manage your charging network with advanced
              monitoring, analytics, and remote control.
            </p>
            <div class="feature-highlight">Advanced analytics</div>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">🛡️</div>
            <h3>Enterprise Security</h3>
            <p>
              Bank-grade security with 99.9% uptime guarantee and 24/7
              monitoring for critical infrastructure.
            </p>
            <div class="feature-highlight">99.9% uptime</div>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">⚡</div>
            <h3>Ultra-Fast Charging</h3>
            <p>
              Support for all connector types and power outputs up to 350kW DC
              fast charging technology.
            </p>
            <div class="feature-highlight">Up to 350kW</div>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">🕒</div>
            <h3>24/7 Monitoring</h3>
            <p>
              Real-time status updates, predictive maintenance, and instant
              alerts for optimal performance.
            </p>
            <div class="feature-highlight">Predictive AI</div>
          </div>

          <div class="feature-card card">
            <div class="feature-icon">🔗</div>
            <h3>Easy Integration</h3>
            <p>
              Simple REST API integration with existing fleet management,
              payment systems, and mobile apps.
            </p>
            <div class="feature-highlight">REST API</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
</script>

<style src="./HomeView.styles.css" scoped></style>
