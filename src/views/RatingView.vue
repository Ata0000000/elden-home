<template>
    <div class="container mt-5">
      <h1 class="text-center">Rate Us!</h1>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <form @submit.prevent="submitRating">
            <div class="mb-3">
              <label for="rating" class="form-label">Your Rating (1-5)</label>
              <input type="number" class="form-control" id="rating" v-model="userRating" min="1" max="5" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
          <p v-if="submitSuccess" class="text-success mt-3">Your rating has been submitted successfully!</p>
        </div>
      </div>
      <div v-if="averageRating !== null" class="mt-5 text-center">
        <h2>Average Rating: {{ averageRating.toFixed(1) }} / 5</h2>
        <p>Total Ratings: {{ ratings.length }}</p>
      </div>
      <div v-if="isAdmin" class="mt-5 text-center">
        <button @click="clearRatings" class="btn btn-danger">Clear All Ratings</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const userRating = ref(null);
  const ratings = ref([]);
  const averageRating = ref(null);
  const submitSuccess = ref(false);
  const router = useRouter();
  
  // 检查用户是否登录并获取是否为管理员
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  onMounted(() => {
  if (!isAuthenticated) {
    router.push('/login');
  } else {
    const storedRatings = JSON.parse(localStorage.getItem('ratings')) || [];
    ratings.value = storedRatings;
    calculateAverage();
    // 强制重新渲染页面
    userRating.value = null;
    submitSuccess.value = false;
  }
});
  
  const submitRating = () => {
    if (userRating.value >= 1 && userRating.value <= 5) {
      ratings.value.push(parseInt(userRating.value, 10));
      localStorage.setItem('ratings', JSON.stringify(ratings.value));
      calculateAverage();
      userRating.value = null;
      submitSuccess.value = true;
      setTimeout(() => {
        submitSuccess.value = false;
      }, 3000); // 3秒后清除成功消息
    }
  };
  
  const calculateAverage = () => {
    const total = ratings.value.reduce((acc, rating) => acc + rating, 0);
    averageRating.value = ratings.value.length ? total / ratings.value.length : 0;
  };
  
  const clearRatings = () => {
    if (confirm("Are you sure you want to clear all ratings?")) {
      ratings.value = [];
      localStorage.removeItem('ratings');
      calculateAverage();
    }
  };
  </script>
  
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  </style>
  