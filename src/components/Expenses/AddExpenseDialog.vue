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
            <q-input v-model.number="expense.amount" label="Amount" suffix="VNĐ" mask="#.###.###.###" unmasked-value
              reverse-fill-mask />
          </div>
          <div class="col">
            <q-input v-model="expense.date" type="date" label="Date" />
          </div>
        </div>
        <div class="q-mt-md flex justify-center items-center">
          <div class="q-mr-sm">Paid by</div>
          <q-btn outline rounded :label="paidUser?.name ?? userStore.user?.name" color="secondary"
            @click="isPaidByUserDialogDisplay = true" dense class="q-px-sm" />
          <div class="q-mx-sm">and split</div>
          <q-btn outline rounded :label="splitStrategyLabel" color="secondary"
            @click="isSplitStrategyDialogDisplay = true" dense class="q-px-sm" :class="$q.screen.lt.sm ? 'q-mt-sm' : ''" />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" @click="closeDialog" />
        <q-btn flat label="Add" color="secondary" @click="onAdd" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <PaidByUserDialog v-model="isPaidByUserDialogDisplay" @update-paid-user="paidUser = $event" />
  <SplitStrategyDialog v-model="isSplitStrategyDialogDisplay" :members="groupStore.group?.members! || []"
    :total-amount="expense.amount" @apply="handleSplitStrategy" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { useUserStore } from 'src/stores/user';
import { useExpenseStore } from 'src/stores/expense';
import { useGroupStore } from 'src/stores/group';
import { useRoute } from 'vue-router';
import PaidByUserDialog from "src/components/Expenses/PaidByUserDialog.vue";
import SplitStrategyDialog from "src/components/Expenses/SplitStrategyDialog.vue";
import type { SplitStrategy, ExpenseShare } from 'src/stores/expense';
import type { User } from 'src/stores/user';

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
    groupStore.fetchGroup(val.value!).catch(err => console.error(err))
  }
})

const splitStrategy = ref<SplitStrategy>({ strategy: 'equally', members: [], splits: {} })
const paidUser = ref(userStore.user)
const isPaidByUserDialogDisplay = ref(false)
const isSplitStrategyDialogDisplay = ref(false)

watch(() => groupStore.group?.members, (members) => {
  if (splitStrategy.value.strategy === 'equally') {
    splitStrategy.value.members = members ?? []
  }
}, { immediate: true })

const splitStrategyLabel = computed(() => {
  if (!splitStrategy.value) return 'equally'
  if (splitStrategy.value.strategy === 'equally') {
    return `equally (${splitStrategy.value.members.length} members)`
  }
  return `unequally (${Object.entries(splitStrategy.value.splits).length} members)`
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

function handleSplitStrategy(strategy: SplitStrategy) {
  splitStrategy.value = strategy
}

function closeDialog() {
  expense.value = {
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: ''
  }
  splitStrategy.value = { strategy: 'equally', members: groupStore.group?.members ?? [], splits: {} }
  emit('update:modelValue', false)
}

async function onAdd() {
  // Build expense shares based on split strategy
  let expenseShares: ExpenseShare[] = []

  if (!splitStrategy.value || splitStrategy.value.strategy === 'equally') {
    const members: User[] = splitStrategy.value?.members ?? [paidUser.value ?? userStore.user!]
    const amountPerMember = expense.value.amount / members.length
    console.log("member", members);

    expenseShares = members.map((member: User) => ({
      id: undefined,
      owingUserId: member.id,
      amount: amountPerMember
    }))
  } else {
    expenseShares = Object.entries(splitStrategy.value.splits).map(([memberId, amount]) => ({
      id: undefined,
      owingUserId: memberId,
      amount: amount
    }))
  }

  await expenseStore.createExpense({
    id: undefined,
    date: expense.value.date,
    createdAt: undefined,
    lastModifiedByUserId: undefined,
    description: expense.value.description,
    amount: expense.value.amount,
    groupId: group.value.value,
    createdByUserId: userStore.user!.id,
    expenseShares,
    // TODO: for now, assume the paid user pays the full amount
    paymentShares: [{
      id: undefined,
      payUserId: paidUser.value?.id ?? userStore.user!.id,
      amount: expense.value.amount
    }]
  })

  closeDialog()
}
</script>
