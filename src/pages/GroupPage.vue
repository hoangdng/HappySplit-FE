<template>
  <q-page class="q-col-gutter-y-sm">
    <div class="text-h4 text-white text-weight-semibold no-padding"
      :class="$q.screen.lt.sm ? 'q-mb-xs text-center' : ''">
      {{ displayGroup?.name }}
    </div>
    <BalanceComponent style="width: 90vw;" />
    <div class="row" style="width: 90vw;">
      <div class="col-4 q-pr-sm gt-xs">
        <div class="bg-white">
          <div class="flex justify-between q-pl-xs q-pr-none">
            <p class="no-margin q-pa-sm text-weight-semibold" :class="$q.screen.gt.xs ? 'text-h5' : 'text-subtitle1'">
              Members
            </p>
            <div class="q-gutter-xs">
              <q-btn 
                :icon="memberViewMode === 'list' ? 'table_view' : 'list'" 
                color="primary" 
                flat 
                dense 
                size="sm"
                @click="toggleMemberViewMode"
              >
                <q-tooltip>{{ memberViewMode === 'list' ? 'Table View' : 'List View' }}</q-tooltip>
              </q-btn>
              <q-btn dense flat color="secondary" label="Invite Member" icon="add" class="q-px-sm"
                @click="displayPromptDialog" />
            </div>
          </div>
          <GroupMemberListItems v-if="memberViewMode === 'list'" />
          <GroupMemberTableView v-else />
        </div>
      </div>
      <div class="col-12 lt-sm">
        <q-expansion-item :label="`Members (${groupMemberNumber})`"
          header-class="text-subtitle2 text-weight-semibold q-px-sm" class="bg-white">
          <div class="q-pa-sm">
            <div class="flex justify-between q-mb-sm">
              <q-btn 
                :icon="memberViewMode === 'list' ? 'table_view' : 'list'" 
                color="primary" 
                flat 
                dense 
                size="sm"
                :label="memberViewMode === 'list' ? 'Table View' : 'List View'"
                @click="toggleMemberViewMode"
              />
              <q-btn dense flat color="secondary" label="Invite Member" icon="add" class="q-px-sm"
                @click="displayPromptDialog" />
            </div>
            <GroupMemberListItems v-if="memberViewMode === 'list'" />
            <GroupMemberTableView v-else />
          </div>
        </q-expansion-item>
      </div>
      <div class="col-8 bg-white">
        Group Page Content
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import GroupMemberListItems from 'src/components/Groups/GroupMemberListItems.vue';
import GroupMemberTableView from 'src/components/Groups/GroupMemberTableView.vue';
import BalanceComponent from 'src/components/BalanceComponent.vue';
import { useGroupStore, type Group } from 'src/stores/group'
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const { group } = storeToRefs(useGroupStore())
const memberViewMode = ref<'list' | 'table'>('list')

// Mock data for demonstration when no real group data
const mockGroup = {
  id: '1',
  name: 'Vacation Trip 2024',
  description: 'Summer vacation expenses',
  avatar: '',
  members: [
    { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-15', groups: [] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-16', groups: [] },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', createdAt: '2024-01-17', groups: [] },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', createdAt: '2024-01-18', groups: [] }
  ],
  ownerEmail: 'john@example.com'
} as Group

const groupStore = useGroupStore()
onMounted(async () => {
  const groupId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  try {
    await groupStore.fetchGroup(groupId)
  } catch {
    // If fetch fails (no backend), use mock data
    console.log('Using mock data for group')
    groupStore.group = mockGroup
  }
})

const displayGroup = computed(() => {
  return group.value || mockGroup
})

const groupMemberNumber = computed(() => {
  return displayGroup.value?.members ? displayGroup.value.members.length : 0
})

function toggleMemberViewMode() {
  memberViewMode.value = memberViewMode.value === 'list' ? 'table' : 'list'
}

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
    inviteMember(displayGroup.value?.id || '', data)
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
