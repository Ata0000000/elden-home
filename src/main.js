import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const app = createApp(App)
app.component('DataTable', DataTable);
app.component('Column', Column);
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaJdgqFOHpYJed-3kjmMc3g9hr5Ytg2nI",
  authDomain: "elden-home.firebaseapp.com",
  projectId: "elden-home",
  storageBucket: "elden-home.appspot.com",
  messagingSenderId: "835429207501",
  appId: "1:835429207501:web:5a44a58392a4d7eac38884"
};

// Initialize Firebase
initializeApp(firebaseConfig);