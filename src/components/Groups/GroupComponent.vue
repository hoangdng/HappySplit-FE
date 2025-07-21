<template>
  <div class="bg-white q-pa-md">
    <div class="flex justify-between q-mb-xs">
      <p class="q-ma-none text-weight-semibold" :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'">
        Groups
      </p>
      <div class="q-gutter-sm">
        <q-btn 
          :icon="viewMode === 'list' ? 'table_view' : 'list'" 
          color="primary" 
          :label="viewMode === 'list' ? 'Table View' : 'List View'" 
          flat 
          dense 
          @click="toggleViewMode" 
        />
        <q-btn icon="add" color="secondary" label="Add group" flat dense @click="isDialogDisplay = true" />
      </div>
      <GroupCreationDialog :model-value="isDialogDisplay" @add="handleAddGroup" />
    </div>
    
    <!-- Toggle between list and table view -->
    <GroupListItems v-if="viewMode === 'list'" :groups="displayGroups" />
    <GroupTableView v-else :groups="displayGroups" />
  </div>
</template>

<script setup lang="ts">
import GroupCreationDialog from './GroupCreationDialog.vue';
import GroupListItems from './GroupListItems.vue';
import GroupTableView from './GroupTableView.vue';
import { ref, computed } from 'vue';
import { useGroupStore, type Group } from 'src/stores/group'
import { useUserStore } from 'src/stores/user'
import { storeToRefs } from 'pinia';

const groupStore = useGroupStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isDialogDisplay = ref(false)
const viewMode = ref<'list' | 'table'>('list')

// Mock data for demonstration
const mockGroups = [
  {
    id: '1',
    name: 'Vacation Trip 2024',
    description: 'Summer vacation expenses',
    avatar: '',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-15', groups: [] },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-16', groups: [] },
      { id: '3', name: 'Bob Wilson', email: 'bob@example.com', createdAt: '2024-01-17', groups: [] }
    ],
    ownerEmail: 'john@example.com'
  },
  {
    id: '2',
    name: 'Office Lunch',
    description: 'Weekly office lunch costs',
    avatar: '',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-02-01', groups: [] },
      { id: '4', name: 'Alice Brown', email: 'alice@example.com', createdAt: '2024-02-02', groups: [] }
    ],
    ownerEmail: 'alice@example.com'
  },
  {
    id: '3',
    name: 'House Rent',
    description: 'Monthly rent and utilities',
    avatar: '',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-03-01', groups: [] },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-03-01', groups: [] },
      { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', createdAt: '2024-03-01', groups: [] },
      { id: '6', name: 'Diana Evans', email: 'diana@example.com', createdAt: '2024-03-02', groups: [] }
    ],
    ownerEmail: 'john@example.com'
  }
] as Group[]

// Use mock data if user groups are not available or empty
const displayGroups = computed(() => {
  return (user.value?.groups && user.value.groups.length > 0) ? user.value.groups : mockGroups
})

function toggleViewMode() {
  viewMode.value = viewMode.value === 'list' ? 'table' : 'list'
}

async function handleAddGroup(groupName: string, groupDescription: string) {
  await groupStore.createGroup(
    {
      id: "",
      name: groupName,
      description: groupDescription,
      avatar: "",
      members: [],
      ownerEmail: ""
    }
  );
  isDialogDisplay.value = false;
}
</script>
