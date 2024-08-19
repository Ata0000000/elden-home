<template>
  <div id="app">
    <h1>Elden Home</h1>

 
    <form v-if="!isLoggedIn" @submit.prevent="login">
      <h2>Login</h2>
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" required />
        <span v-if="!emailValid">Please input valid email</span>
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" required />
        <span v-if="!passwordValid">Password must be at least 6 characters</span>
      </div>
      <button type="submit">Login</button>
    </form>

    
    <div v-if="isLoggedIn">
      <h2>Welcome, {{ userRole }}!</h2>

      <form @submit.prevent="submitForm">
        <div>
          <label for="phone">Phone:</label>
          <input v-model="phone" type="tel" required pattern="^\d{10}$" />
          <span v-if="!phoneValid">Please input valid phone number</span>
        </div>
        <button type="submit">Submit</button>
      </form>

      <ul>
        <li v-for="item in items" :key="item.id">{{ item.name }}</li>
      </ul>


      <div v-if="userRole === 'user'">
        <h2>Rating</h2>
        <div>
          <label v-for="star in 5" :key="star">
            <input type="radio" :value="star" v-model="userRating" />
            {{ star }} Star
          </label>
        </div>
        <button @click="submitRating">Submit Rating</button>
        <p>Average Rating: {{ averageRating }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      phone: '',
      userRole: '',
      isLoggedIn: false,
      items: [],
      userRating: 0,
      ratings: JSON.parse(localStorage.getItem('ratings')) || [],
    };
  },
  computed: {
    emailValid() {
      return this.email.includes('@');
    },
    passwordValid() {
      return this.password.length >= 6;
    },
    phoneValid() {
      return /^\d{10}$/.test(this.phone);
    },
    averageRating() {
      return this.ratings.length
        ? (
            this.ratings.reduce((total, rating) => total + rating, 0) /
            this.ratings.length
          ).toFixed(1)
        : 0;
    },
  },
  methods: {
    login() {
      if (this.emailValid && this.passwordValid) {
        this.isLoggedIn = true;
        
        this.userRole = this.email === 'admin@eldenhome.com' ? 'admin' : 'user';
        localStorage.setItem('user', JSON.stringify({ email: this.email, role: this.userRole }));
        alert('Login successful');
      } else {
        alert('Invalid login details');
      }
    },
    submitForm() {
      if (this.phoneValid) {
        alert('Submit successfully');
      } else {
        alert('Error in submission');
      }
    },
    fetchData() {
      this.items = JSON.parse(localStorage.getItem('items')) || [];
    },
    submitRating() {
      this.ratings.push(this.userRating);
      localStorage.setItem('ratings', JSON.stringify(this.ratings));
      alert('Rating submitted');
    },
  },
  mounted() {
    this.fetchData();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.email = user.email;
      this.userRole = user.role;
      this.isLoggedIn = true;
    }
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}

form {
  margin-bottom: 30px;
}

input {
  margin-bottom: 10px;
}

span {
  color: red;
}

ul {
  list-style-type: none;
  padding: 0;
}

h2 {
  margin-top: 20px;
}
</style>
