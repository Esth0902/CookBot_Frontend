<template>
  <div>
    <div class="filter-controls">
      <input type="text" v-model="usernameFilter" placeholder="Filter by username..." class="filter-input" />
      <input type="number" v-model.number="minTokensFilter" placeholder="Minimum tokens" class="filter-input" />
      <button @click="applyTokenFilter" class="filter-button">Filter</button>
      <button @click="clearFilters" class="filter-button clear">Clear</button>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th @click="toggleSort" class="sortable-header">
              Total Tokens
              <span v-if="sortOrder === 'asc'">▲</span>
              <span v-if="sortOrder === 'desc'">▼</span>
            </th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in displayedData" :key="user.username">
            <td>{{ user.username }}</td>
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

interface UserMetric {
  username: string;
  totalTokens: number;
}

const props = defineProps<{
  userData: UserMetric[]
}>();

// --- STATE ---
const sortOrder = ref<'asc' | 'desc' | 'none'>('none');
const usernameFilter = ref('');
const minTokensFilter = ref<number | null>(null);
const appliedMinTokens = ref<number | null>(null);

// --- FINAL DISPLAY DATA ---
const displayedData = ref<UserMetric[]>([]);
const maxTokens = ref(1);

// --- WATCH EFFECT to manually trigger reactivity ---
watch(
  () => [props.userData, usernameFilter.value, appliedMinTokens.value, sortOrder.value],
  () => {
    let data = [...props.userData];

    // Apply username filter
    if (usernameFilter.value) {
      data = data.filter(user =>
        user.username.toLowerCase().startsWith(usernameFilter.value.toLowerCase())
      );
    }

    // Apply token filter
    if (appliedMinTokens.value !== null && appliedMinTokens.value >= 0) {
      data = data.filter(user => user.totalTokens >= appliedMinTokens.value!);
    }
    
    // Update max tokens for the bar scaling based on the filtered data
    const currentMax = Math.max(...data.map(user => user.totalTokens));
    maxTokens.value = currentMax > 0 ? currentMax : 1;

    // Apply sort
    if (sortOrder.value === 'asc') {
      data.sort((a, b) => a.totalTokens - b.totalTokens);
    } else if (sortOrder.value === 'desc') {
      data.sort((a, b) => b.totalTokens - a.totalTokens);
    }

    displayedData.value = data;
  },
  { immediate: true, deep: true } // immediate to run on load, deep for userData changes
);


// --- METHODS ---
const toggleSort = () => {
  if (sortOrder.value === 'none') {
    sortOrder.value = 'asc';
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'none';
  }
};

const applyTokenFilter = () => {
  appliedMinTokens.value = minTokensFilter.value;
};

const clearFilters = () => {
  usernameFilter.value = '';
  minTokensFilter.value = null;
  appliedMinTokens.value = null;
};
</script>

<style scoped>
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
  align-items: center;
}

.filter-input {
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--ion-text-color);
  border-radius: 4px;
}

.filter-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--ion-color-primary);
  color: #000;
  cursor: pointer;
}

.filter-button.clear {
  background-color: var(--ion-color-secondary);
}

.table-container {
  width: 100%;
  overflow-x: auto;
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
  background-color: var(--ion-color-primary);
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
