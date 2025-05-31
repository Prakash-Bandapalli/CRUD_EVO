<template>
  <div class="loading-spinner-overlay" v-if="overlay && visible">
    <div class="spinner-container">
      <div class="spinner" :style="spinnerStyle"></div>
      <p v-if="text" class="spinner-text">{{ text }}</p>
    </div>
  </div>
  <div v-else-if="visible" class="spinner-inline-container">
    <div class="spinner" :style="spinnerStyle"></div>
    <p v-if="text && !overlay" class="spinner-text inline">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  size: {
    type: [String, Number],
    default: "medium", // Default size
  },
  color: {
    type: String,
    default: "var(--color-primary, #007bff)", // Default to CSS variable or a fallback
  },
  trackColor: {
    type: String,
    default: "rgba(0, 0, 0, 0.1)",
  },
  thickness: {
    type: [String, Number],
    default: "medium", // 'thin', 'medium', 'thick' or numeric
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
});

const sizeMap = {
  small: "20px",
  medium: "40px",
  large: "60px",
};

const thicknessMap = {
  thin: "2px",
  medium: "4px",
  thick: "6px",
};

const spinnerStyle = computed(() => {
  const s =
    typeof props.size === "number"
      ? `${props.size}px`
      : sizeMap[props.size] || sizeMap.medium;
  const t =
    typeof props.thickness === "number"
      ? `${props.thickness}px`
      : thicknessMap[props.thickness] || thicknessMap.medium;
  return {
    width: s,
    height: s,
    borderColor: props.trackColor,
    borderLeftColor: props.color,
    borderWidth: t,
  };
});
</script>

<style scoped>
.loading-spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner-container {
  text-align: center;
}

.spinner-inline-container {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm, 8px);
}

.spinner {
  border-style: solid;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-text {
  margin-top: var(--spacing-sm, 8px);
  font-size: 0.9rem;
  color: var(--color-dark-text, #212529);
}
.spinner-text.inline {
  margin-top: 0;
  margin-left: var(--spacing-sm, 8px);
}
</style>
