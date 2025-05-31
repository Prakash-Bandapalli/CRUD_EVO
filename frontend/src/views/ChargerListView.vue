<template>
  <div class="charger-layout-container">
    <div class="map-panel">
      <MapDisplay
        :chargers="filteredStations"
        :selected-station-id="selectedStationId"
        @marker-click="handleMarkerSelect"
        v-if="!isLoadingInitial && !pageErrorOccurred && !initialLoadSpinner"
      />
      <div v-if="initialLoadSpinner" class="map-placeholder">
        <LoadingSpinner size="large" text="Loading Map & Stations..." />
      </div>
      <div
        v-if="!isLoadingInitial && pageErrorOccurred && !initialLoadSpinner"
        class="map-placeholder error-text"
      >
        Could not load station data for map. Please try again later.
      </div>
      <div
        v-if="
          !isLoadingInitial &&
          !pageErrorOccurred &&
          stations.length === 0 &&
          !initialLoadSpinner
        "
        class="map-placeholder"
      >
        No stations to display on map.
      </div>
    </div>

    <div class="sidebar-panel">
      <div class="sidebar-content">
        <div class="sidebar-fixed-content">
          <div class="add-station-global">
            <button
              @click="navigateToAddStation"
              class="btn btn-success global-add-btn"
              :disabled="isAnyLoading"
            >
              <span class="plus-icon">+</span> Add New Station
            </button>
          </div>

          <div class="toggle-filters-section">
            <button
              @click="toggleFilters"
              class="btn btn-outline-secondary toggle-filters-btn"
              :disabled="isAnyLoading"
            >
              <span>{{ showFilters ? "Hide" : "Show" }} Filters</span>
              <span class="filter-icon">{{ showFilters ? "▲" : "▼" }}</span>
            </button>
          </div>

          <Transition name="fade-slide-fast">
            <div class="filters-card card" v-if="showFilters">
              <form @submit.prevent="applyFilters" class="filter-form">
                <div class="filter-input-row">
                  <div class="filter-group">
                    <label for="filter-status" class="form-label">Status</label>
                    <select
                      id="filter-status"
                      class="form-control form-control-sm"
                      v-model="currentFilterInputs.status"
                      :disabled="isAnyLoading"
                    >
                      <option value="">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Under Maintenance">Maintenance</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                  <div class="filter-group">
                    <label for="filter-power" class="form-label"
                      >Min Power (kW)</label
                    >
                    <input
                      type="number"
                      id="filter-power"
                      class="form-control form-control-sm"
                      v-model.number="currentFilterInputs.powerOutput"
                      placeholder="Any"
                      min="0"
                      step="any"
                      :disabled="isAnyLoading"
                    />
                  </div>
                  <div class="filter-group">
                    <label for="filter-connector" class="form-label"
                      >Connector</label
                    >
                    <input
                      type="text"
                      id="filter-connector"
                      class="form-control form-control-sm"
                      v-model.trim="currentFilterInputs.connectorType"
                      placeholder="Any type"
                      :disabled="isAnyLoading"
                    />
                  </div>
                </div>
                <div class="filter-button-row">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm"
                    :disabled="isAnyLoading"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    @click="clearAndResetFilters"
                    class="btn btn-outline-secondary btn-sm clear-filters-btn"
                    v-if="hasActiveFiltersApplied"
                    title="Clear Applied Filters"
                    :disabled="isAnyLoading"
                  >
                    ✕ Clear
                  </button>
                </div>
              </form>
            </div>
          </Transition>

          <div
            class="details-card selected-station-details-section card"
            v-if="selectedStationDetails && !initialLoadSpinner"
          >
            <h3 class="card-title">
              Station: {{ selectedStationDetails.name }}
            </h3>
            <div
              v-if="
                isDeleting && deletingStationId === selectedStationDetails._id
              "
              class="action-in-progress-overlay"
            >
              <LoadingSpinner size="medium" text="Deleting..." />
            </div>
            <div
              class="details-content"
              :class="{
                'content-busy':
                  isDeleting &&
                  deletingStationId === selectedStationDetails._id,
              }"
            >
              <p>
                <strong>Status:</strong>
                <span
                  :class="statusClass(selectedStationDetails.status)"
                  class="detail-status-text"
                  >{{ selectedStationDetails.status }}</span
                >
              </p>
              <p>
                <strong>Power:</strong>
                {{ selectedStationDetails.powerOutput }} kW
              </p>
              <p>
                <strong>Connector:</strong>
                {{ selectedStationDetails.connectorType }}
              </p>
              <p>
                <strong>Location:</strong> Lat:
                {{ selectedStationDetails.location.coordinates[1].toFixed(5) }},
                Lng:
                {{ selectedStationDetails.location.coordinates[0].toFixed(5) }}
              </p>
              <p v-if="selectedStationDetails.location.address">
                <strong>Address:</strong>
                <em>{{ selectedStationDetails.location.address }}</em>
              </p>
              <p
                v-if="
                  selectedStationDetails.createdBy &&
                  selectedStationDetails.createdBy.email
                "
                class="creator-info"
              >
                <strong>By:</strong>
                <span
                  v-if="
                    isCurrentUserCreator(selectedStationDetails.createdBy._id)
                  "
                  class="created-by-me"
                >
                  Me ({{ selectedStationDetails.createdBy.email }})</span
                >
                <span v-else>
                  {{ selectedStationDetails.createdBy.email }}
                </span>
              </p>
              <div class="actions item-actions">
                <button
                  v-if="authStore.isAuthenticated"
                  @click="editStation(selectedStationDetails._id)"
                  class="btn btn-warning btn-sm action-btn edit-btn"
                  :disabled="isAnyLoading"
                >
                  Edit
                </button>
                <button
                  v-if="authStore.isAuthenticated"
                  @click="
                    handleDeleteStation(
                      selectedStationDetails._id,
                      selectedStationDetails.name
                    )
                  "
                  class="btn btn-danger btn-sm action-btn delete-btn"
                  :disabled="isAnyLoading"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="!selectedStationDetails && !initialLoadSpinner"
            class="no-selection-message card"
          >
            <p>Select a station from the map or list to view details.</p>
          </div>
        </div>

        <div class="list-card condensed-list-section card">
          <h4 class="card-title list-title">
            Stations
            <span class="station-count">({{ filteredStations.length }})</span>
          </h4>
          <div v-if="isLoadingInitial && !isDeleting" class="loading-sidebar">
            <LoadingSpinner size="medium" text="Loading list..." />
          </div>
          <div
            v-if="pageErrorOccurred && !isLoadingInitial"
            class="error-message small-error"
          >
            Failed to load stations. Please try again later.
          </div>
          <div
            v-if="
              !isLoadingInitial &&
              !isDeleting &&
              !pageErrorOccurred &&
              filteredStations.length === 0 &&
              stations.length > 0
            "
            class="no-stations-sidebar"
          >
            No stations match filters.
          </div>
          <div
            v-if="
              !isLoadingInitial &&
              !isDeleting &&
              !pageErrorOccurred &&
              stations.length === 0
            "
            class="no-stations-sidebar"
          >
            No stations found.
          </div>
          <ul
            v-if="
              !isLoadingInitial &&
              !isDeleting &&
              !pageErrorOccurred &&
              filteredStations.length > 0
            "
            class="station-list-condensed"
          >
            <li
              v-for="station in filteredStations"
              :key="station._id"
              :id="`station-item-${station._id}`"
              class="station-list-item"
              :class="{
                selected: station._id === selectedStationId,
                'item-busy': isDeleting && deletingStationId === station._id,
              }"
              @click="handleListSelect(station._id)"
              tabindex="0"
              @keypress.enter="handleListSelect(station._id)"
              :aria-disabled="isAnyLoading"
            >
              <div class="station-item-main">
                <span class="station-name">{{ station.name }}</span>
                <span class="station-power">{{ station.powerOutput }} kW</span>
              </div>
              <span
                :class="statusClass(station.status)"
                class="station-status-badge"
                >{{ station.status }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch, nextTick } from "vue";
import {
  fetchStations as apiFetchStations,
  deleteStation as apiDeleteStation,
} from "@/services/apiService";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import MapDisplay from "@/components/MapDisplay.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { useToast } from "vue-toastification";

const stations = ref([]);
const isLoadingInitial = ref(true);
const isDeleting = ref(false);
const deletingStationId = ref(null);
const pageErrorOccurred = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isAnyLoading = computed(() => isLoadingInitial.value || isDeleting.value);
const initialLoadSpinner = computed(
  () =>
    isLoadingInitial.value &&
    stations.value.length === 0 &&
    !pageErrorOccurred.value
);

const currentFilterInputs = reactive({
  status: "",
  powerOutput: null,
  connectorType: "",
});
const activeFilters = reactive({
  status: "",
  powerOutput: null,
  connectorType: "",
});
const selectedStationId = ref(null);
const showFilters = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const selectedStationDetails = computed(() => {
  if (!selectedStationId.value || stations.value.length === 0) return null;
  return stations.value.find((s) => s._id === selectedStationId.value) || null;
});

const isCurrentUserCreator = (creatorId) => {
  if (!authStore.isAuthenticated || !authStore.currentUser) return false;
  return String(authStore.currentUser._id) === String(creatorId);
};

const statusClass = (status) => {
  if (!status) return "";
  return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
};

const filteredStations = computed(() => {
  if (!stations.value) return [];
  return stations.value.filter((station) => {
    const statusMatch = activeFilters.status
      ? station.status === activeFilters.status
      : true;
    const powerMatch =
      activeFilters.powerOutput !== null && activeFilters.powerOutput !== ""
        ? station.powerOutput >= parseFloat(activeFilters.powerOutput)
        : true;
    const connectorMatch = activeFilters.connectorType
      ? station.connectorType
          .toLowerCase()
          .includes(activeFilters.connectorType.toLowerCase())
      : true;
    return statusMatch && powerMatch && connectorMatch;
  });
});

watch(filteredStations, (newFilteredList) => {
  if (
    selectedStationId.value &&
    !newFilteredList.find((s) => s._id === selectedStationId.value)
  ) {
    selectedStationId.value = null;
  }
});

const hasActiveFiltersApplied = computed(() => {
  return (
    activeFilters.status !== "" ||
    (activeFilters.powerOutput !== null && activeFilters.powerOutput !== "") ||
    activeFilters.connectorType !== ""
  );
});

const loadStations = async () => {
  isLoadingInitial.value = true;
  pageErrorOccurred.value = false;
  try {
    const response = await apiFetchStations();
    if (response.data && response.data.success) {
      stations.value = response.data.data;
    } else {
      throw new Error(response.data.error || "Failed to fetch stations");
    }
  } catch (err) {
    console.error("Error fetching stations:", err);
    const errorMessage =
      err.response?.data?.error ||
      err.message ||
      "An error occurred while fetching stations.";
    toast.error(errorMessage);
    pageErrorOccurred.value = true;
    if (err.response?.status === 401 && authStore.isAuthenticated) {
      authStore.logout();
    }
  } finally {
    isLoadingInitial.value = false;
  }
};

onMounted(() => {
  loadStations();
});

const applyFilters = () => {
  activeFilters.status = currentFilterInputs.status;
  activeFilters.powerOutput =
    currentFilterInputs.powerOutput === "" ||
    currentFilterInputs.powerOutput === null
      ? null
      : parseFloat(currentFilterInputs.powerOutput);
  activeFilters.connectorType = currentFilterInputs.connectorType;
};

const clearAndResetFilters = () => {
  currentFilterInputs.status = "";
  currentFilterInputs.powerOutput = null;
  currentFilterInputs.connectorType = "";
  applyFilters();
};

const handleMarkerSelect = (stationId) => {
  selectedStationId.value = stationId;
  nextTick(() => {
    const listItemElement = document.getElementById(
      `station-item-${stationId}`
    );
    if (listItemElement) {
      listItemElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
};

const handleListSelect = (stationId) => {
  selectedStationId.value = stationId;
};

const navigateToAddStation = () => {
  if (isAnyLoading.value) return;
  router.push("/chargers/add");
};

const editStation = (stationId) => {
  if (isAnyLoading.value) return;
  router.push(`/chargers/edit/${stationId}`);
};

const handleDeleteStation = async (stationId, stationName) => {
  if (isAnyLoading.value) return;
  if (window.confirm(`Are you sure you want to delete "${stationName}"?`)) {
    isDeleting.value = true;
    deletingStationId.value = stationId;
    pageErrorOccurred.value = false;
    try {
      await apiDeleteStation(stationId);
      stations.value = stations.value.filter((s) => s._id !== stationId);
      if (selectedStationId.value === stationId) {
        selectedStationId.value = null;
      }
      toast.success(`Station "${stationName}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting station:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Could not delete the station.";
      toast.error(errorMessage);
      pageErrorOccurred.value = true;
    } finally {
      isDeleting.value = false;
      deletingStationId.value = null;
    }
  }
};
</script>

<style src="./ChargerListView.styles.css" scoped></style>
<style scoped>
.action-in-progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: inherit;
}
.details-content.content-busy > *:not(.actions),
.station-list-item.item-busy > *:not(.actions-placeholder-if-any) {
  opacity: 0.5;
  pointer-events: none;
}
.map-placeholder,
.loading-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
}
.error-message.small-error {
  font-size: 0.9rem;
  padding: 10px;
  margin: 10px 20px;
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
}
</style>
