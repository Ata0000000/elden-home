<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
    <p v-if="successMessage" class="text-success">
      {{ successMessage }} <a href="#" @click="goToAboutUs">click here</a>
    </p>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref(null);
const successMessage = ref(null);
const emit = defineEmits(['authChange']);
const router = useRouter();

const login = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username.value && u.password === password.value);

  if (user) {
    localStorage.setItem('isAuthenticated', 'true');
    successMessage.value = 'Login successful! To visit the About Us page, ';
    error.value = null;
    emit('authChange', true); // Emit event to update authentication status
  } else {
    error.value = 'Invalid username or password';
    successMessage.value = null;
  }
};

const goToAboutUs = () => {
  router.push('/about');
};
</script>
