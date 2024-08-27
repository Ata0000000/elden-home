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
      </ul>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();

// 计算属性判断用户是否已登录
const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');

// 处理“Rate Us”按钮点击事件
const handleRateUsClick = () => {
  if (isAuthenticated.value) {
    // 已登录，跳转到评分页面
    router.push('/rating');
  } else {
    // 未登录，跳转到登录页面
    router.push('/login');
  }
};
const isAdmin = computed(() => localStorage.getItem('isAdmin') === 'true');

// 处理登出操作
const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
  const event = new CustomEvent('authChange', { detail: false });
  window.dispatchEvent(event);
  router.push('/login');
};


// 监听登录状态变化
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
