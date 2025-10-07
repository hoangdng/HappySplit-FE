<template>
  <q-dialog :model-value="props.modelValue" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Paid by</div>
      </q-card-section>
      <q-list bordered separator>
        <q-item v-for="member in groupMembers" :key="member.id" clickable v-ripple
          @click="chosenUser = member" :class="isUserChosen(member) ? 'bg-blue-2' : ''">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ member.name.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ member.name }}</q-item-label>
            <q-item-label caption>{{ member.email }}</q-item-label>
          </q-item-section>
          <q-item-section avatar v-if="isUserChosen(member)">
            <q-avatar icon="check" />
          </q-item-section>
        </q-item>
      </q-list>
      <q-card-actions align="right">
        <q-btn flat label="OK" color="secondary" @click="onConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useUserStore } from 'src/stores/user';
import type { User } from 'src/stores/user';
import { useGroupStore } from 'src/stores/group';

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'update-paid-user'])
const userStore = useUserStore()
const groupStore = useGroupStore()

const groupMembers = computed(() => {
  return groupStore.group?.members || []
})

const chosenUser = ref(userStore.user)

const isUserChosen = computed(() => {
  return (user: User) => {
    return chosenUser.value?.email === user.email
  }
})

function onConfirm() {
  emit('update:modelValue', false)
  emit('update-paid-user', chosenUser.value)
}
</script>
