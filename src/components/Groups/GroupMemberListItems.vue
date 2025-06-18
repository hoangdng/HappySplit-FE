<template>
  <q-list separator>
    <q-item v-for="member in group?.members" :key="member.id" class="q-px-md">
      <q-item-section avatar>
        <q-avatar :color="groupOwner?.email === member.email ? 'warning' : 'primary'" text-color="white">
          {{ member.name.charAt(0).toUpperCase() }}
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ member.name }}</q-item-label>
        <q-item-label caption lines="1">{{ member.email }}</q-item-label>
      </q-item-section>
      <q-item-section side v-if="groupOwner?.email === member.email">
        <q-icon color="warning" name="copyright" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useGroupStore } from 'src/stores/group';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const groupStore = useGroupStore();
const { group } = storeToRefs(groupStore);

const groupOwner = computed(() => {
  if (group.value?.members) {
    for (const member of group.value.members) {
      if (member.email === group.value.ownerEmail) {
        return member;
      }
    }
  }
  return null;
});

</script>
