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
      <!-- 添加导出按钮 -->
      <button @click="exportToCSV">Export to CSV</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import users from '@/assets/data/users.json';
import { saveAs } from 'file-saver';

const usersTable = ref(null);

onMounted(() => {
  $(usersTable.value).DataTable({
    "ordering": true  // 启用排序
  });
});

// 导出 CSV 方法
const exportToCSV = () => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "ID,First Name,Last Name,Email\n"; // 添加标题行
  users.forEach(user => {
    const row = `${user.id},${user.first_name},${user.last_name},${user.email}`;
    csvContent += row + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, "users-data.csv");
};
</script>

<style scoped>
.table-container {
  margin-bottom: 50px;
}
</style>
