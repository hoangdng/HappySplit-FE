<template>
  <q-table
    :rows="tableRows"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 10 }"
    class="bg-white"
  >
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center">
          <q-avatar 
            :color="props.row.isOwner ? 'warning' : 'primary'" 
            text-color="white" 
            class="q-mr-sm"
          >
            {{ props.row.name.charAt(0).toUpperCase() }}
          </q-avatar>
          <div>
            <div class="text-weight-medium">{{ props.row.name }}</div>
            <div class="text-caption text-grey-6">{{ props.row.email }}</div>
          </div>
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-role="props">
      <q-td :props="props">
        <q-chip
          :color="props.row.isOwner ? 'warning' : 'primary'"
          text-color="white"
          :label="props.row.role"
          size="sm"
        >
          <q-icon 
            v-if="props.row.isOwner" 
            name="copyright" 
            size="xs" 
            class="q-ml-xs"
          />
        </q-chip>
      </q-td>
    </template>

    <template v-slot:body-cell-balance="props">
      <q-td :props="props">
        <div :class="props.row.balance < 0 ? 'text-negative' : 'text-positive'">
          {{ formatCurrency(props.row.balance) }}
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-joinedDate="props">
      <q-td :props="props">
        <div class="text-body2">{{ formatDate(props.row.joinedDate) }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGroupStore } from 'src/stores/group';
import { storeToRefs } from 'pinia';

const groupStore = useGroupStore();
const { group } = storeToRefs(groupStore);

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Member',
    align: 'left' as const,
    field: 'name',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Role',
    align: 'center' as const,
    field: 'role',
    sortable: true,
  },
  {
    name: 'balance',
    label: 'Balance',
    align: 'right' as const,
    field: 'balance',
    sortable: true,
    sort: (a: number, b: number) => a - b,
  },
  {
    name: 'joinedDate',
    label: 'Joined',
    align: 'center' as const,
    field: 'joinedDate',
    sortable: true,
  },
];

// Convert member data to table rows with additional computed fields
const tableRows = computed(() => {
  if (!group.value?.members) return [];
  
  return group.value.members.map(member => ({
    id: member.id,
    name: member.name,
    email: member.email,
    isOwner: member.email === group.value?.ownerEmail,
    role: member.email === group.value?.ownerEmail ? 'Owner' : 'Member',
    balance: Math.floor(Math.random() * 1000000) - 500000, // Mock balance data
    joinedDate: new Date(member.createdAt || new Date()).toISOString(),
  }));
});

function formatCurrency(amount: number): string {
  return amount < 0 
    ? `- $${Math.abs(amount).toLocaleString()}` 
    : `+ $${amount.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}
</script>