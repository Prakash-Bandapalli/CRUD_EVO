<template>
  <div id="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <!-- Optional Footer can go here -->
  </div>
</template>

<script setup>
// No longer need useAuthStore or handleLogout here if Navbar handles it
import Navbar from "@/components/Nav-bar.vue"; // <-- IMPORT THE NEW NAVBAR
</script>

<style>
/* Styles from your global.css (imported in main.js) will apply. */
/* You might keep some very minimal, app-level layout styles here if needed, */
/* or move them to global.css as well. */

#app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-light-gray); /* Consistent app background */
}

.main-content {
  flex-grow: 1;
}
</style>
