<template>
  <q-list separator>
    <q-item v-ripple v-for="group in props.groups" :key="group.id" class="q-px-md" clickable
      @click="goToGroup(group.id)" style="cursor: pointer">
      <q-item-section avatar>
        <q-avatar color="primary" text-color="white">
          {{ group.avatar || group.name.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ group.name }}</q-item-label>
        <q-item-label caption lines="1">You owe 150.000đ</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="secondary" name="visibility" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Group } from '../../stores/group';
import { useRouter } from 'vue-router'

const router = useRouter()

async function goToGroup(groupId: string) {
  await router.push('/groups/' + groupId)
}

const props = defineProps<{
  groups: Group[] | undefined
}>()

</script>
