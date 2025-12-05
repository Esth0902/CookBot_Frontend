<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th @click="toggleSort" class="sortable-header">
            Total Tokens
            <span v-if="sortOrder === 'asc'">▲</span>
            <span v-if="sortOrder === 'desc'">▼</span>
          </th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sortedUserData" :key="user.userId">
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
import { defineProps, computed, ref } from 'vue';

interface UserMetric {
  userId: string;
  totalTokens: number;
}

const props = defineProps<{
  userData: UserMetric[]
}>();

const sortOrder = ref<'asc' | 'desc' | 'none'>('none');

const sortedUserData = computed(() => {
  const data = [...props.userData];
  if (sortOrder.value === 'asc') {
    return data.sort((a, b) => a.totalTokens - b.totalTokens);
  }
  if (sortOrder.value === 'desc') {
    return data.sort((a, b) => b.totalTokens - a.totalTokens);
  }
  return data;
});

const maxTokens = computed(() => {
  if (!props.userData || props.userData.length === 0) {
    return 1; // Avoid division by zero
  }
  return Math.max(...props.userData.map(user => user.totalTokens));
});

const toggleSort = () => {
  if (sortOrder.value === 'none') {
    sortOrder.value = 'asc';
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'none';
  }
};
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
  color: var(--ion-text-color);
}

th, td {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

thead tr {
  background-color: rgba(0, 0, 0, 0.2);
}

.sortable-header {
  cursor: pointer;
  user-select: none;
}

.sortable-header:hover {
  background-color: var(--ion-color-secondary);
  color: #000;
}

.bar-container {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  height: 20px;
}

.bar {
  height: 100%;
  background-color: var(--ion-color-primary);
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}
</style>
