<template>
  <q-list separator>
    <q-item v-for="expense in expenses" :key="expense.id ?? expense.description">
      <div class="row q-col-gutter-sm" style="width: 100%;">
        <div class="col-xs-2 col-sm-1 bg-blue-4 text-white q-pa-sm column items-center justify-center">
          <div :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'">{{ getExpenseMonth(expense.date!) }}</div>
          <div :class="$q.screen.gt.xs ? 'text-h4' : 'text-subtitle1'">{{ getExpenseDate(expense.date!) }}</div>
        </div>
        <div class="col-6">
          <div class="text-h6">{{ expense.description }}</div>
          <div>{{ expense.amount }} VNĐ</div>
        </div>
        <div class="col-4">
          <div>paid by {{ getPaidByName(expense) }} and split equally</div>
        </div>
      </div>
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import { useExpenseStore } from 'src/stores/expense';
import type { Expense } from 'src/stores/expense';
import { storeToRefs } from 'pinia';
import { useGroupStore } from 'src/stores/group';

const expenseStore = useExpenseStore();
const { expenses } = storeToRefs(expenseStore);

function getExpenseDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function getExpenseMonth(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

function getPaidByName(expense: Expense) {
  const groupStore = useGroupStore();
  if (expense.expenseShares.length === 1) {
    return groupStore.group?.members?.find(
      (member) => member.id === expense.expenseShares[0]!.owingUserId,
    )?.name;
  }

  return 'Multiple Users'
}

</script>
