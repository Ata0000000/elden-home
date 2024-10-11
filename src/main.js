import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Import Firebase libraries
import { initializeApp } from "firebase/app";
import { getFunctions } from 'firebase/functions';

import 'mapbox-gl/dist/mapbox-gl.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaJdgqFOHpYJed-3kjmMc3g9hr5Ytg2nI",
  authDomain: "elden-home.firebaseapp.com",
  projectId: "elden-home",
  storageBucket: "elden-home.appspot.com",
  messagingSenderId: "835429207501",
  appId: "1:835429207501:web:5a44a58392a4d7eac38884"
};

// Initialize Firebase
const appInstance = initializeApp(firebaseConfig);

// Get Firebase Functions instance
const functions = getFunctions(appInstance);

// Create Vue application
const app = createApp(App);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(router);

// Mount Vue application
app.mount('#app');

// Export Firebase services to be used in other parts of the application
export { functions };
