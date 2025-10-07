<template>
  <q-dialog :model-value="props.modelValue" @hide="closeDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add Expense</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-if="isGroupDetailsRoute" :modelValue="group?.label" label="Group" disable />
        <q-select v-else v-model="group" :options="groupOptions" label="Group" />
        <q-input v-model="expense.description" label="Description" type="textarea" autogrow />
        <div class="row q-gutter-x-md">
          <div class="col">
            <q-input v-model="expense.amount" label="Amount" suffix="VNĐ" mask="#.###.###.###" unmasked-value
              reverse-fill-mask />
          </div>
          <div class="col">
            <q-input v-model="expense.date" type="date" label="Date" />
          </div>
        </div>
        <div class="q-mt-md flex justify-center items-center">
          <div class="q-mr-sm">Paid by</div>
          <q-btn outline rounded :label="paidUser?.name ?? userStore.user?.name" color="secondary"
            @click="isPaidByUserDialogDisplay = true" dense/>
          <div class="q-mx-sm">and split</div>
          <q-btn outline rounded :label="splitStrategy" color="secondary" dense />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" @click="closeDialog" />
        <q-btn flat label="Add" color="secondary" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <PaidByUserDialog v-model="isPaidByUserDialogDisplay" @update-paid-user="paidUser = $event" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useUserStore } from 'src/stores/user';
import { useExpenseStore } from 'src/stores/expense';
import { useGroupStore } from 'src/stores/group';
import { useRoute } from 'vue-router';
import PaidByUserDialog from "src/components/Expenses/PaidByUserDialog.vue";

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const expenseStore = useExpenseStore()
const groupStore = useGroupStore()
const route = useRoute()

const splitStrategy = ref('equally')
const paidUser = ref(userStore.user)
const isPaidByUserDialogDisplay = ref(false)

const isGroupDetailsRoute = computed(() => route.name === 'groupDetails')
const group = computed({
  get: () => {
    return { label: groupStore.group?.name, value: groupStore.group?.id }
  },
  set: (val) => {
    groupStore.fetchGroup(val.value!).catch(err => console.error(err))
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
    groupId: group.value.value,
    createdByUserId: userStore.user!.id,
    expenseShares: [
      {
        id: undefined,
        owingUserId: paidUser.value?.id ?? userStore.user!.id,
        amount: expense.value.amount,
      }
    ]
  })

  closeDialog()
}
</script>
