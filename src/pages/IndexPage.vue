<template>
  <q-page class="q-col-gutter-y-sm">
    <BalanceComponent style="width: 90vw;" />
    <div class="row" style="width: 90vw;">
      <div class="col-8 bg-white q-px-md" :class="$q.screen.lt.sm ? 'hidden' : ''">
        sdas
      </div>
      <div class="col-sm-4 col-xs-12" :class="$q.screen.gt.xs ? 'q-pl-sm' : ''">
        <GroupComponent />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import GroupComponent from 'components/Groups/GroupComponent.vue';
import { useUserStore } from 'src/stores/user'
import { onMounted } from 'vue';
import BalanceComponent from 'components/BalanceComponent.vue';

const userStore = useUserStore()
onMounted(async () => {
  await userStore.fetchCurrentUser()
})

const $q = useQuasar();
</script>
