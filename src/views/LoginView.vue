<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div v-if="isAuthenticated" class="text-end mb-3">
          <p>Hi, {{ storedUsername }}</p>
          <button @click="logout" class="btn btn-link">Logout</button>
        </div>
        <div v-else class="login-card card shadow-sm p-4">
          <h1 class="text-center mb-4">Login</h1>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input type="text" class="form-control" id="username" v-model="username" />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input type="password" class="form-control" id="password" v-model="password" />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </div>
          </form>
          <p v-if="error" class="text-danger mt-3">{{ error }}</p>
          <p v-if="successMessage" class="text-success mt-3">
            {{ successMessage }} <a href="#" @click.prevent="goToAboutUs">click here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref(null);
const successMessage = ref(null);
const router = useRouter();

const isAuthenticated = computed(() => localStorage.getItem('isAuthenticated') === 'true');
const storedUsername = computed(() => localStorage.getItem('username'));

const login = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username.value && u.password === password.value);

  if (user) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username.value);
    successMessage.value = 'Login successful! To visit the About Us page, ';
    error.value = null;
    const event = new CustomEvent('authChange', { detail: true });
    window.dispatchEvent(event);
    // 登录成功后直接导航到评分页面
    router.push('/rating');
  } else {
    error.value = 'Invalid username or password';
    successMessage.value = null;
  }
};


const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  const event = new CustomEvent('authChange', { detail: false });
  window.dispatchEvent(event);
  router.push('/login');
};


const goToAboutUs = () => {
  router.push('/about');
};
</script>


<style scoped>
.login-card {
  background-color: #fff;
  border-radius: 10px;
}
.text-center {
  text-align: center;
}
</style>