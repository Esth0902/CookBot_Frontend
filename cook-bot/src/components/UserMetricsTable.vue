<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Total Tokens</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userData" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>{{ user.totalTokens }}</td>
          <td>
            <div class="bar-container">
              <div class="bar" :style="{ width: (user.totalTokens / maxTokens) * 100 + '%' }"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

interface UserMetric {
  userId: string;
  totalTokens: number;
}

const props = defineProps<{
  userData: UserMetric[]
}>();

const maxTokens = computed(() => {
  if (!props.userData || props.userData.length === 0) {
    return 1; // Avoid division by zero
  }
  return Math.max(...props.userData.map(user => user.totalTokens));
});
</script>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

thead tr {
  background-color: #42b983;
}

.bar-container {
  width: 100%;
  background-color: #302323;
  border-radius: 4px;
  height: 20px;
}

.bar {
  height: 100%;
  background-color: #42b983;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}
</style>
