<template>
  <div class="row q-col-gutter-y-sm justify-center">
    <div class="col-sm-4 col-xs-12" :class="$q.screen.gt.xs ? 'q-pr-sm' : 'no-padding'">
      <q-card class="bg-white text-black" flat>
        <q-card-section :class="$q.screen.lt.sm ? 'q-pa-sm' : ''">
          <div :class="$q.screen.gt.xs ? 'text-subtitle1' : 'text-subtitle2'">Total Expense</div>
          <div
            :class="[$q.screen.gt.xs ? 'text-h5 text-weight-bold' : 'text-body1 text-weight-bold', props.totalExpense < 0 ? 'text-negative' : 'text-positive']">
            {{ formatNumberWithDot(props.totalExpense) }} VNĐ
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-sm-4 col-xs-6">
      <q-card class="bg-white text-black" flat>
        <q-card-section :class="$q.screen.lt.sm ? 'q-pa-sm' : ''">
          <div :class="$q.screen.gt.xs ? 'text-subtitle1' : 'text-subtitle2'">You Owe</div>
          <div class="text-negative" :class="$q.screen.gt.xs ? 'text-h5' : 'text-body1'">$ {{ props.oweAmount }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-sm-4 col-xs-6 q-pl-sm">
      <q-card class="bg-white text-black" flat>
        <q-card-section :class="$q.screen.lt.sm ? 'q-pa-sm' : ''">
          <div :class="$q.screen.gt.xs ? 'text-subtitle1' : 'text-subtitle2'">You Are Owed</div>
          <div class="text-positive" :class="$q.screen.gt.xs ? 'text-h5' : 'text-body1'">$ {{ props.loanAmount }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { defineProps } from 'vue';

const $q = useQuasar();

const props = defineProps<{
  totalExpense: number,
  oweAmount: number,
  loanAmount: number
}>()

function formatNumberWithDot(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
</script>
