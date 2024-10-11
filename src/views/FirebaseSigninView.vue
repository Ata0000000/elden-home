<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
  <p v-if="role">Logged in as: {{ role }}</p>
  <p v-if="userInfo">Current User: {{ userInfo.email }} (Role: {{ role }})</p>
  <button v-if="isLoggedIn" @click="signout">Sign Out</button>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const role = ref("");
const userInfo = ref(null);
const isLoggedIn = ref(false);
const router = useRouter();
const auth = getAuth();

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log("Firebase Sign-In Successful!");
      localStorage.setItem('isAuthenticated', 'true'); // 保存登录状态
      router.push("/about"); // 登录成功后跳转到about页面
    })
    .catch((error) => {
      console.log("Sign-in error:", error.code);
      localStorage.removeItem('isAuthenticated');
    });
};

const signout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
      localStorage.removeItem('isAuthenticated');
      router.push("/login");
    })
    .catch((error) => {
      console.log("Error signing out:", error);
    });
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userInfo.value = user;
      isLoggedIn.value = true;
    } else {
      userInfo.value = null;
      isLoggedIn.value = false;
      localStorage.removeItem('isAuthenticated');
      router.push("/login");
    }
  });
});
</script>
