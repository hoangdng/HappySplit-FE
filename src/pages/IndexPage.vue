<template>
  <q-page class="column justify-start items-center q-py-lg q-col-gutter-y-sm">
    <div style="width: 90vw;">
      <BalanceComponent />
    </div>
    <div class="row" style="width: 90vw;">
      <div class="col-8 bg-white q-px-md" :class="$q.screen.lt.sm ? 'hidden' : ''" style="opacity: 0.8;">
        sdas
      </div>
      <div class="col-sm-4 col-xs-12 " :class="$q.screen.gt.xs ? 'q-pl-sm' : ''">
        <GroupComponent />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import BalanceComponent from 'components/BalanceComponent.vue';
import GroupComponent from 'components/Groups/GroupComponent.vue';
import { useUserStore } from 'src/stores/user'
import { onMounted } from 'vue';

const userStore = useUserStore()
onMounted(async () => {
  await userStore.fetchUser()
})

const $q = useQuasar();
</script>
