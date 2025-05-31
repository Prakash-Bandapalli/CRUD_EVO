<template>
  <div class="edit-station-container">
    <h2>Edit Charging Station</h2>

    <div v-if="initialLoading" class="loading">
      <LoadingSpinner size="large" text="Loading station data..." />
    </div>

    <form
      v-if="!initialLoading && !pageErrorOnLoad"
      @submit.prevent="handleUpdateStation"
      class="station-form"
    >
      <div class="form-group">
        <label for="name">Station Name:</label>
        <input
          type="text"
          id="name"
          v-model="station.name"
          required
          :disabled="isSubmitting"
        />
      </div>

      <div class="form-group">
        <label for="address">Address (Optional):</label>
        <input
          type="text"
          id="address"
          v-model="station.location.address"
          :disabled="isSubmitting"
        />
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
            :disabled="isSubmitting"
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
            :disabled="isSubmitting"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select
          id="status"
          v-model="station.status"
          required
          :disabled="isSubmitting"
        >
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
          :disabled="isSubmitting"
        />
      </div>

      <div class="form-group">
        <label for="connectorType">Connector Type:</label>
        <input
          type="text"
          id="connectorType"
          v-model="station.connectorType"
          required
          :disabled="isSubmitting"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          <LoadingSpinner
            v-if="isSubmitting"
            size="small"
            color="white"
            thickness="thin"
            class="button-spinner"
          />
          <span v-if="isSubmitting">Updating...</span>
          <span v-else>Update Station</span>
        </button>
        <button
          type="button"
          @click="cancel"
          class="cancel-btn"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import {
  fetchStationById as apiFetchStationById,
  updateStation as apiUpdateStation,
} from "@/services/apiService";
import { useRouter, useRoute } from "vue-router";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useToast } from "vue-toastification";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const stationId = ref(route.params.id);

const station = reactive({
  name: "",
  location: { type: "Point", coordinates: [], address: "" },
  status: "Active",
  powerOutput: null,
  connectorType: "",
});

const latitude = ref(null);
const longitude = ref(null);

const initialLoading = ref(true);
const isSubmitting = ref(false);
const pageErrorOnLoad = ref(false);

onMounted(async () => {
  if (!stationId.value) {
    toast.error("Station ID is missing. Cannot load data.");
    pageErrorOnLoad.value = true;
    initialLoading.value = false;
    router.push("/chargers");
    return;
  }
  initialLoading.value = true;
  pageErrorOnLoad.value = false;
  try {
    const response = await apiFetchStationById(stationId.value);
    if (response.data && response.data.success) {
      const fetchedStation = response.data.data;
      station.name = fetchedStation.name;
      station.location.address = fetchedStation.location.address || "";
      if (fetchedStation.location && fetchedStation.location.coordinates) {
        longitude.value = fetchedStation.location.coordinates[0];
        latitude.value = fetchedStation.location.coordinates[1];
        station.location.coordinates = [...fetchedStation.location.coordinates];
      }
      station.status = fetchedStation.status;
      station.powerOutput = fetchedStation.powerOutput;
      station.connectorType = fetchedStation.connectorType;
    } else {
      throw new Error(
        response.data.error || "Failed to fetch station details."
      );
    }
  } catch (error) {
    console.error("Error fetching station details:", error);
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Could not load station data.";
    toast.error(errorMessage);
    pageErrorOnLoad.value = true;
    if (error.response?.status === 401) {
      const authStore = (await import("@/stores/authStore")).useAuthStore();
      authStore.logout();
    }
  } finally {
    initialLoading.value = false;
  }
});

watch([latitude, longitude], ([newLat, newLng]) => {
  if (newLat !== null && newLng !== null) {
    station.location.coordinates = [newLng, newLat];
  }
});

const handleUpdateStation = async () => {
  if (
    !station.name ||
    latitude.value === null ||
    longitude.value === null ||
    !station.status ||
    !station.powerOutput ||
    !station.connectorType
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }
  if (
    latitude.value < -90 ||
    latitude.value > 90 ||
    longitude.value < -180 ||
    longitude.value > 180
  ) {
    toast.error("Invalid latitude or longitude values.");
    return;
  }
  if (station.powerOutput <= 0) {
    toast.error("Power output must be a positive value.");
    return;
  }

  isSubmitting.value = true;
  try {
    const updatePayload = {
      name: station.name,
      location: {
        type: "Point",
        coordinates: station.location.coordinates,
        address: station.location.address,
      },
      status: station.status,
      powerOutput: station.powerOutput,
      connectorType: station.connectorType,
    };
    const response = await apiUpdateStation(stationId.value, updatePayload);
    if (response.data && response.data.success) {
      toast.success("Station updated successfully!");
      router.push("/chargers");
    } else {
      toast.error(response.data.error || "Failed to update station.");
    }
  } catch (error) {
    console.error("Error updating station:", error);
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "An error occurred while updating the station.";
    toast.error(errorMessage);
    if (error.response?.status === 401) {
      const authStore = (await import("@/stores/authStore")).useAuthStore();
      authStore.logout();
    }
  } finally {
    isSubmitting.value = false;
  }
};

const cancel = () => {
  if (isSubmitting.value) return;
  router.push("/chargers");
};
</script>

<style scoped>
.edit-station-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 25px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.edit-station-container h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}
.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-message {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 18px;
  text-align: center;
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
.station-form select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
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
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.submit-btn {
  background-color: #007bff;
  color: white;
}
.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}
.submit-btn:disabled {
  background-color: #6cace4;
  cursor: not-allowed;
}
.cancel-btn {
  background-color: #6c757d;
  color: white;
}
.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}
.cancel-btn:disabled {
  background-color: #a0a8af;
  cursor: not-allowed;
}
.button-spinner {
  margin-right: 8px;
}
.submit-btn span {
  display: inline-block;
}
</style>
