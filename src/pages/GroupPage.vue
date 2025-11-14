<template>
  <q-page class="q-col-gutter-y-sm">
    <div class="text-h4 text-white text-weight-semibold no-padding"
      :class="$q.screen.lt.sm ? 'q-mb-xs text-center' : ''">
      {{ group?.name }}
    </div>
    <BalanceComponent style="width: 90vw;" :total-expense="groupStore.getTotalExpense"
      :owe-amount="groupStore.getTotalOwe" :loan-amount="groupStore.getTotalLoan" />
    <div class="row" style="width: 90vw;">
      <div class="col-4 q-pr-sm gt-xs">
        <div class="bg-white">
          <div class="flex justify-between q-pl-xs q-pr-none">
            <p class="no-margin q-pa-sm text-weight-semibold" :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'">
              Members
            </p>
            <q-btn dense flat color="secondary" label="Invite Member" icon="add" class="q-px-sm"
              @click="displayPromptDialog" />
          </div>
          <GroupMemberListItems />
        </div>
      </div>
      <div class="col-12 lt-sm">
        <q-expansion-item :label="`Members (${groupMemberNumber})`"
          header-class="text-subtitle2 text-weight-semibold q-px-sm" class="bg-white">
          <q-btn dense flat color="secondary" label="Invite Member" icon="add" class="q-px-sm"
            @click="displayPromptDialog" />
          <GroupMemberListItems />
        </q-expansion-item>
      </div>
      <div class="col-xs-12 bg-white col-sm-8" :class="$q.screen.lt.sm ? 'q-mt-sm' : ''">
        <p class="no-margin q-pa-sm text-weight-semibold" :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'">
          Expenses
        </p>
        <ExpenseList />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GroupMemberListItems from 'src/components/Groups/GroupMemberListItems.vue';
import ExpenseList from 'src/components/Expenses/ExpenseList.vue';
import BalanceComponent from 'src/components/BalanceComponent.vue';
import { useGroupStore } from 'src/stores/group'
import { useUserStore } from 'src/stores/user'
import { useExpenseStore } from 'src/stores/expense'
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const { group } = storeToRefs(useGroupStore())

const groupStore = useGroupStore()
const expenseStore = useExpenseStore()
const userStore = useUserStore()
onMounted(async () => {
  const groupId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  await groupStore.fetchGroup(groupId!)
  await expenseStore.fetchExpensesByGroup(groupId!)
  await userStore.fetchCurrentUser()
})

const groupMemberNumber = computed(() => {
  return group.value?.members ? group.value.members.length : 0
})

async function inviteMember(groupId: string, email: string) {
  await groupStore.sendInvitation(groupId, email)
}

function displayPromptDialog() {
  $q.dialog({
    title: 'Invite member to group',
    message: 'Enter Gmail of new member:',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    inviteMember(group.value?.id || '', data)
      .then(() => {
        $q.notify({
          type: 'positive',
          message: 'An invitation email is sent to ' + data,
          icon: 'mail'
        })
      })
      .catch((error) => {
        $q.notify({
          type: 'negative',
          message: 'Failed to send invitation: ' + (error?.message || error),
          icon: 'error'
        })
      })
  })
}

</script>
