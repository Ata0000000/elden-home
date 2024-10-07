<template>
    <div>
      <table ref="usersTable" class="display">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.first_name }}</td>
            <td>{{ user.last_name }}</td>
            <td>{{ user.email }}</td>

          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import users from '@/assets/data/users.json';
  
  const usersTable = ref(null);
  
  onMounted(() => {
    $(usersTable.value).DataTable(); // 使用 jQuery 初始化 DataTable
  });
  $(usersTable.value).DataTable({
  "ordering": true,  // 启用排序
});

  </script>
  
  
  
  <style scoped>

  .table-container {
    margin-bottom: 50px;
  }
  </style>
  