<template>
  <q-dialog :model-value="props.modelValue" @hide="closeDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add Expense</div>
      </q-card-section>
      <q-card-section>
        <q-input v-if="isGroupDetailsRoute" :modelValue="group?.label" label="Group" disable />
        <q-select v-else v-model="group" :options="groupOptions" label="Group" />
        <q-input v-model="expense.date" type="date" label="Date" />
        <q-input v-model="expense.amount" label="Amount" />
        <q-input v-model="expense.description" label="Description" type="textarea" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" @click="closeDialog" />
        <q-btn flat label="Add" color="secondary" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useUserStore } from 'src/stores/user';
import { useExpenseStore } from 'src/stores/expense';
import { useGroupStore } from 'src/stores/group';
import { useRoute } from 'vue-router';

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const expenseStore = useExpenseStore()
const groupStore = useGroupStore()
const route = useRoute()

const isGroupDetailsRoute = computed(() => route.name === 'groupDetails')
const group = computed({
  get: () => {
    return { label: groupStore.group?.name, value: groupStore.group?.id }
  },
  set: (val) => {
    groupStore.fetchGroup(val?.value).catch(err => console.error(err))
  }
})

const expense = ref({
  date: new Date().toISOString().split('T')[0],
  amount: 0,
  description: ''
})


const groupOptions = computed(() =>
  userStore.user?.groups!.map(group => ({
    label: group.name,
    value: group.id
  }))
)

function closeDialog() {
  expense.value = {
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: ''
  }
  emit('update:modelValue', false)
}

async function onAdd() {
  await expenseStore.createExpense({
    id: undefined,
    date: expense.value.date,
    createdAt: undefined,
    lastModifiedByUserId: undefined,
    description: expense.value.description,
    amount: expense.value.amount,
    groupId: group.value?.value,
    createdByUserId: userStore.user?.id,
    paidByUserId: userStore.user?.id,
    expenseShares: []
  })

  closeDialog()
}
</script>
