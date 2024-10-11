<template>
  <div class="about">
    <h1>Elden Home</h1>
    <p>Welcome to Elden Home.</p>
    <p>This is the best place for you!</p>

    <!-- Search location form -->
    <form @submit.prevent="performSearch">
      <input type="text" placeholder="Search a location" v-model="searchQuery">
      <button type="submit">Search</button>
    </form>

    <!-- Navigation form -->
    <form @submit.prevent="performNavigation">
      <input type="text" placeholder="Enter start location" v-model="startLocationQuery">
      <input type="text" placeholder="Enter destination location" v-model="endLocationQuery">
      <button type="submit">Navigate</button>
    </form>

    <!-- Map container -->
    <div ref="mapContainer" class="mapContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGFvaHUiLCJhIjoiY20xeXlpM3M3MDFqYjJqcHcwdWt0eG12diJ9.OlVgVlKgl8CsPPnS79QJug';

const mapContainer = ref(null);
const searchQuery = ref('');
const startLocationQuery = ref('');
const endLocationQuery = ref('');
let map;
let startCoordinates = ref(null);
let endCoordinates = ref(null);

// Search function for a single location
const performSearch = async () => {
  if (!searchQuery.value) {
    alert('Please enter a location.');
    return;
  }

  try {
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.value)}.json?access_token=${mapboxgl.accessToken}`);
    const { features } = response.data;
    if (features.length > 0) {
      const [lng, lat] = features[0].center;
      map.flyTo({ center: [lng, lat], zoom: 14 });
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    } else {
      alert('Location not found, please try again.');
    }
  } catch (error) {
    console.error('Error searching location:', error);
    alert('Failed to perform search, please try again.');
  }
};

// Navigation function between two points
const performNavigation = async () => {
  if (!startLocationQuery.value || !endLocationQuery.value) {
    alert('Please enter both start and destination locations.');
    return;
  }

  try {
    // Search for the starting location
    const startResponse = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(startLocationQuery.value)}.json?access_token=${mapboxgl.accessToken}`);
    const { features: startFeatures } = startResponse.data;
    if (startFeatures.length > 0) {
      const [startLng, startLat] = startFeatures[0].center;
      startCoordinates.value = [startLng, startLat];
      new mapboxgl.Marker({ color: 'green' }).setLngLat(startCoordinates.value).addTo(map);
    } else {
      alert('Start location not found, please try again.');
      return;
    }

    // Search for the destination location
    const endResponse = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(endLocationQuery.value)}.json?access_token=${mapboxgl.accessToken}`);
    const { features: endFeatures } = endResponse.data;
    if (endFeatures.length > 0) {
      const [endLng, endLat] = endFeatures[0].center;
      endCoordinates.value = [endLng, endLat];
      new mapboxgl.Marker({ color: 'red' }).setLngLat(endCoordinates.value).addTo(map);

      // Plan the route between the two points
      planRoute(startCoordinates.value, endCoordinates.value);
    } else {
      alert('Destination location not found, please try again.');
    }
  } catch (error) {
    console.error('Error performing navigation:', error);
    alert('Failed to perform navigation, please try again.');
  }
};

// Function to plan the route between two points
const planRoute = async (start, end) => {
  try {
    const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}.json?geometries=geojson&access_token=${mapboxgl.accessToken}`);
    const { routes } = response.data;
    
    if (routes.length > 0) {
      const route = routes[0].geometry;

      // Add the route to the map
      if (map.getSource('route')) {
        map.getSource('route').setData({
          type: 'Feature',
          geometry: route
        });
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        });
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5
          }
        });
      }
    }
  } catch (error) {
    console.error('Error planning route:', error);
    alert('Failed to plan route, please try again.');
  }
};

// Initialize the map on component mount
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.0060, 40.7128], // Default center (New York City)
    zoom: 9
  });
});
</script>

<style>
.about .mapContainer {
  height: 400px;
  width: 100%;
  margin-top: 20px;
}
</style>
