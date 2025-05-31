<template>
  <div class="add-station-container">
    <h2>Add New Charging Station</h2>
    <form @submit.prevent="handleAddStation" class="station-form">
      <div class="form-group">
        <label for="name">Station Name:</label>
        <input type="text" id="name" v-model="station.name" required />
      </div>

      <div class="form-group">
        <label for="address">Address (Optional):</label>
        <input type="text" id="address" v-model="station.location.address" />
      </div>

      <div class="form-group location-group">
        <div>
          <label for="latitude">Latitude:</label>
          <input
            type="number"
            step="any"
            id="latitude"
            v-model.number="latitude"
            required
          />
        </div>
        <div>
          <label for="longitude">Longitude:</label>
          <input
            type="number"
            step="any"
            id="longitude"
            v-model.number="longitude"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="station.status" required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Coming Soon">Coming Soon</option>
        </select>
      </div>

      <div class="form-group">
        <label for="powerOutput">Power Output (kW):</label>
        <input
          type="number"
          step="any"
          id="powerOutput"
          v-model.number="station.powerOutput"
          required
          min="0.1"
        />
      </div>

      <div class="form-group">
        <label for="connectorType">Connector Type:</label>
        <input
          type="text"
          id="connectorType"
          v-model="station.connectorType"
          required
        />
        <!-- Or use a select if you have predefined types:
        <select id="connectorType" v-model="station.connectorType" required>
          <option value="Type 1 (J1772)">Type 1 (J1772)</option>
          <option value="Type 2 (Mennekes)">Type 2 (Mennekes)</option>
          <option value="CCS Combo 1">CCS Combo 1</option>
          <option value="CCS Combo 2">CCS Combo 2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Tesla (NACS)">Tesla (NACS)</option>
          <option value="Other">Other</option>
        </select>
        -->
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? "Adding..." : "Add Station" }}
        </button>
        <button type="button" @click="cancel" class="cancel-btn">Cancel</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { createStation as apiCreateStation } from "@/services/apiService";
import { useRouter } from "vue-router";

const router = useRouter();

const station = reactive({
  name: "",
  location: {
    coordinates: [],
    address: "",
  },
  status: "Active",
  powerOutput: null,
  connectorType: "",
});

// Separate refs for latitude and longitude for easier v-model handling with type="number"
const latitude = ref(null);
const longitude = ref(null);

const isLoading = ref(false);
const errorMessage = ref("");

const handleAddStation = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  // Construct the coordinates array in the correct order [longitude, latitude]
  station.location.coordinates = [longitude.value, latitude.value];

  if (
    !station.name ||
    !latitude.value ||
    !longitude.value ||
    !station.status ||
    !station.powerOutput ||
    !station.connectorType
  ) {
    errorMessage.value = "Please fill in all required fields.";
    isLoading.value = false;
    return;
  }
  if (station.powerOutput <= 0) {
    errorMessage.value = "Power output must be a positive value.";
    isLoading.value = false;
    return;
  }
  if (
    latitude.value < -90 ||
    latitude.value > 90 ||
    longitude.value < -180 ||
    longitude.value > 180
  ) {
    errorMessage.value = "Invalid latitude or longitude values.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiCreateStation(station);
    if (response.data && response.data.success) {
      router.push("/chargers"); // Navigate back to the list
    } else {
      errorMessage.value =
        response.data.error || "Failed to add station. Unexpected response.";
    }
  } catch (error) {
    console.error("Error adding station:", error);
    errorMessage.value =
      error.response?.data?.error ||
      error.message ||
      "An error occurred while adding the station.";
  } finally {
    isLoading.value = false;
  }
};

const cancel = () => {
  router.push("/chargers");
};
</script>

<style scoped>
.add-station-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-station-container h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.station-form .form-group {
  margin-bottom: 18px;
}

.station-form label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}

.station-form input[type="text"],
.station-form input[type="number"],
.station-form input[type="email"],
.station-form input[type="password"],
.station-form select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.station-form input[type="number"] {
  -moz-appearance: textfield;
}
.station-form input[type="number"]::-webkit-outer-spin-button,
.station-form input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.location-group {
  display: flex;
  gap: 15px;
}
.location-group > div {
  flex: 1;
}

.form-actions {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.submit-btn {
  background-color: #28a745; /* Green */
  color: white;
}
.submit-btn:hover {
  background-color: #218838;
}
.submit-btn:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #6c757d; /* Gray */
  color: white;
}
.cancel-btn:hover {
  background-color: #5a6268;
}

.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
</style>
