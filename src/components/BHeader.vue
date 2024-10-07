<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">Signup</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
        <li class="nav-item">
              <router-link to="/rating" class="nav-link" :key="router.currentRoute.fullPath">Rate Us</router-link>
            </li>

        <li class="nav-item" v-if="isAuthenticated">
          <button class="btn btn-link" @click="logout">Logout</button>
        </li>
        <li class="nav-item" v-if="isAdmin">
            <router-link to="/admin" class="nav-link">Administer</router-link>
          </li>

        <li class="nav-item" v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
        </li>
        <li class = "nav-item">
          <router-link to="/Firelogin" class ='nav-link' active-class="active">Firebase Login</router-link>
        </li>
        <li class="nav-item">
            <router-link to="/FireRegister" class = "nav-link" active-class="active">Firebase Register</router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
      <router-link to="/admin-email" class="nav-link">AdminEmail</router-link>
    </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();


const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');


const handleRateUsClick = () => {
  if (isAuthenticated.value) {
    
    router.push('/rating');
  } else {
 
    router.push('/login');
  }
};
const isAdmin = computed(() => localStorage.getItem('isAdmin') === 'true');


const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  const event = new CustomEvent('authChange', { detail: false });
  window.dispatchEvent(event);
  router.push('/login');
};

const updateAuthenticationStatus = (status) => {
  isAuthenticated.value = status;
};

const handleAuthChange = (status) => {
  updateAuthenticationStatus(status);
};

window.addEventListener('authChange', (event) => {
  handleAuthChange(event.detail);
});
</script>

<style scoped>
  .b-example-divider {
    height: 3rem;
    background-color: rgba(0, 0, 0, 0.1);
    border: solid rgba(0, 0, 0, 0.15);
    border-width: 1px 0;
    box-shadow: inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1), inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
  }

  .form-control-dark {
    color: #fff;
    background-color: var(--bs-dark);
    border-color: var(--bs-gray);
  }

  .form-control-dark:focus {
    color: #fff;
    background-color: var(--bs-dark);
    border-color: #fff;
    box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
  }

  .bi {
    vertical-align: -0.125em;
    fill: currentColor;
  }

  .text-small {
    font-size: 85%;
  }

  .dropdown-toggle {
    outline: 0;
  }
</style>
