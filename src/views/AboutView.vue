<template>
  <div class="about">
    <h1>Elden Home</h1>
    <p>Welcome to Elden Home.</p>
    <p>This is the best place for you!</p>
    <input type="text" placeholder="Enter a location" v-model="searchQuery" @keyup.enter="performSearch">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="mapContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1Ijoid2VudGFvaHUiLCJhIjoiY20xeXlpM3M3MDFqYjJqcHcwdWt0eG12diJ9.OlVgVlKgl8CsPPnS79QJug';

const mapContainer = ref(null);
const state = reactive({
  map: null,
  searchQuery: ''
});

const performSearch = async () => {
  console.log("Searching for:", state.searchQuery); // 显示当前搜索词
  const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(state.searchQuery)}.json?access_token=${mapboxgl.accessToken}`);
  console.log("API response:", response.data); // 显示API响应内容

  const { features } = response.data;
  if (features.length > 0) {
    const [lng, lat] = features[0].center;
    console.log("Location found:", lng, lat); // 显示找到的坐标
    state.map.flyTo({ center: [lng, lat], zoom: 14 });
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(state.map);
  } else {
    console.log("No features found"); // 如果没有找到特征点
  }
};


onMounted(() => {
  state.map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.0060, 40.7128],
    zoom: 9
  });
});
</script>


<style>
.about .mapContainer {
  height: 300px !important;  /* 使用 !important 确保样式应用 */
  width: 50% !important;     /* 调整为 80% 宽度查看效果 */

}
</style>

