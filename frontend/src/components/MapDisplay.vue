<template>
  <div class="map-container-wrapper">
    <div class="map-render-area" ref="mapContainerRef"></div>
    <button
      v-if="map && props.chargers.length > 1"
      @click="zoomOutToFitAll"
      class="zoom-out-button"
      title="Zoom out to fit all markers"
    >
      Zoom Out
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { defineEmits, defineProps } from "vue";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const props = defineProps({
  chargers: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedStationId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["marker-click", "map-ready"]);

const mapContainerRef = ref(null);
let map = null;
let markersLayer = null;
const leafletMarkers = new Map();

const DEFAULT_ZOOM_WHEN_SELECTING = 10; // A closer default zoom when selecting one
const FLY_TO_DURATION = 2;

const initializeMap = () => {
  if (mapContainerRef.value && !map) {
    let initialCenter = [20, 0];
    let initialZoom = 2;

    if (props.chargers.length > 0 && props.chargers[0].location?.coordinates) {
      const firstChargerLoc = props.chargers[0].location.coordinates;
      if (
        typeof firstChargerLoc[1] === "number" &&
        typeof firstChargerLoc[0] === "number"
      ) {
        initialCenter = [firstChargerLoc[1], firstChargerLoc[0]];
        initialZoom = 10;
      }
    }
    map = L.map(mapContainerRef.value).setView(initialCenter, initialZoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    markersLayer = L.layerGroup().addTo(map);
    emit("map-ready");
  }
};

const updateMarkersAndFitBounds = () => {
  if (!map || !markersLayer) return;

  markersLayer.clearLayers();
  leafletMarkers.clear();

  if (props.chargers.length === 0) {
    return;
  }

  const bounds = L.latLngBounds();
  props.chargers.forEach((charger) => {
    if (charger.location && charger.location.coordinates) {
      const lat = charger.location.coordinates[1];
      const lng = charger.location.coordinates[0];
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        !isNaN(lat) &&
        !isNaN(lng)
      ) {
        const marker = L.marker([lat, lng]);
        let popupContent = `<b>${charger.name}</b><br>Status: ${charger.status}`;
        marker.bindPopup(popupContent);
        marker.on("click", () => {
          emit("marker-click", charger._id);
        });
        markersLayer.addLayer(marker);
        leafletMarkers.set(charger._id, marker);
        bounds.extend([lat, lng]);
      }
    }
  });

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] }); // No maxZoom, lets it zoom closer
  } else if (props.chargers.length > 0) {
    const firstCharger = props.chargers[0];
    if (
      firstCharger.location?.coordinates &&
      typeof firstCharger.location.coordinates[1] === "number" &&
      typeof firstCharger.location.coordinates[0] === "number"
    ) {
      map.setView(
        [
          firstCharger.location.coordinates[1],
          firstCharger.location.coordinates[0],
        ],
        DEFAULT_ZOOM_WHEN_SELECTING - 2
      ); // Slightly less zoom than select
    }
  }
};

// Function for the "Zoom Out" button
const zoomOutToFitAll = () => {
  if (!map || props.chargers.length === 0) return;
  const bounds = L.latLngBounds();
  props.chargers.forEach((charger) => {
    // Re-calculate bounds based on current (filtered) chargers
    if (charger.location && charger.location.coordinates) {
      const lat = charger.location.coordinates[1];
      const lng = charger.location.coordinates[0];
      if (
        typeof lat === "number" &&
        typeof lng === "number" &&
        !isNaN(lat) &&
        !isNaN(lng)
      ) {
        bounds.extend([lat, lng]);
      }
    }
  });
  if (bounds.isValid()) {
    map.flyToBounds(bounds, { padding: [50, 50], duration: FLY_TO_DURATION });
  }
};

watch(
  () => props.chargers,
  () => {
    if (map) {
      updateMarkersAndFitBounds(); // This will fit bounds when chargers change
    }
  },
  { deep: true, immediate: false }
);

watch(
  () => props.selectedStationId,
  (newId) => {
    if (!map || !newId) {
      return;
    }
    const marker = leafletMarkers.get(newId);
    if (marker) {
      if (map.hasLayer(marker)) {
        // Zoom closer when a specific marker is selected
        map.flyTo(marker.getLatLng(), DEFAULT_ZOOM_WHEN_SELECTING, {
          animate: true,
          duration: FLY_TO_DURATION,
        });
        setTimeout(() => {
          if (marker.getPopup() && !marker.isPopupOpen()) {
            marker.openPopup();
          }
        }, FLY_TO_DURATION * 1000 * 0.7);
      }
    }
  }
);

onMounted(async () => {
  await nextTick();
  initializeMap();
  if (props.chargers.length > 0 && map) {
    // Initial fit if chargers are already there
    updateMarkersAndFitBounds();
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.map-container-wrapper {
  width: 100%;
  height: 100%;
  position: relative; /* Needed for absolute positioning of the button */
}
.map-render-area {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
.zoom-out-button {
  position: absolute;
  top: 10px;
  right: 10px; /* Position top-right */
  z-index: 1000; /* Ensure it's above map tiles */
  padding: 8px 12px;
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.4);
}
.zoom-out-button:hover {
  background-color: #f4f4f4;
}
</style>
