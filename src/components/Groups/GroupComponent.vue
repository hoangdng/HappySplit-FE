<template>
  <div class="bg-white q-pa-sm" :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'" style="opacity: 0.8;">
    <div class="flex justify-between text-weight-semibold q-mb-xs q-pa-xs">
      <p class="q-ma-none">Groups</p>
      <q-btn icon="add" color="secondary" label="Add group" flat dense @click="isDialogDisplay = true" />
      <GroupCreationDialog :model-value="isDialogDisplay" @add="handleAddGroup" />
    </div>
    <GroupListItems :groups="user?.groups" />
  </div>
</template>

<script setup lang="ts">
import GroupCreationDialog from './GroupCreationDialog.vue';
import GroupListItems from './GroupListItems.vue';
import { ref } from 'vue';
import { useGroupStore } from 'src/stores/group'
import { useUserStore } from 'src/stores/user'
import { storeToRefs } from 'pinia';

const groupStore = useGroupStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isDialogDisplay = ref(false)

async function handleAddGroup(groupName: string, groupDescription: string) {
  await groupStore.createGroup(
    {
      id: "",
      name: groupName,
      description: groupDescription,
      avatar: ""
    }
  );
  isDialogDisplay.value = false;
}
</script>
