<template>
  <q-table
    :rows="tableRows"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 10 }"
    class="bg-white"
  >
    <template v-slot:body-cell-name="props">
      <q-td :props="props" class="cursor-pointer" @click="goToGroup(props.row.id)">
        <div class="row items-center">
          <q-avatar color="primary" text-color="white" class="q-mr-sm">
            {{ props.row.avatar || props.row.name.charAt(0).toUpperCase() }}
          </q-avatar>
          <div>
            <div class="text-weight-medium">{{ props.row.name }}</div>
            <div class="text-caption text-grey-6">{{ props.row.description || 'No description' }}</div>
          </div>
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-balance="props">
      <q-td :props="props">
        <div :class="props.row.balance < 0 ? 'text-negative' : 'text-positive'">
          {{ formatCurrency(props.row.balance) }}
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-members="props">
      <q-td :props="props">
        <q-chip 
          color="primary" 
          text-color="white" 
          :label="props.row.memberCount + ' members'"
          size="sm"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn 
          flat 
          round 
          color="secondary" 
          icon="visibility" 
          size="sm"
          @click="goToGroup(props.row.id)"
        >
          <q-tooltip>View Group</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Group } from '../../stores/group';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  groups: Group[] | undefined;
}>();

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Group Name',
    align: 'left' as const,
    field: 'name',
    sortable: true,
  },
  {
    name: 'balance',
    label: 'Your Balance',
    align: 'right' as const,
    field: 'balance',
    sortable: true,
    sort: (a: number, b: number) => a - b,
  },
  {
    name: 'members',
    label: 'Members',
    align: 'center' as const,
    field: 'memberCount',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center' as const,
    field: 'actions',
    sortable: false,
  },
];

// Convert group data to table rows with additional computed fields
const tableRows = computed(() => {
  if (!props.groups) return [];
  
  return props.groups.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    avatar: group.avatar,
    balance: Math.floor(Math.random() * 1000000) - 500000, // Mock balance data
    memberCount: group.members?.length || 0,
    ownerEmail: group.ownerEmail,
  }));
});

async function goToGroup(groupId: string) {
  await router.push('/groups/' + groupId);
}

function formatCurrency(amount: number): string {
  return amount < 0 
    ? `- $${Math.abs(amount).toLocaleString()}` 
    : `+ $${amount.toLocaleString()}`;
}
</script>