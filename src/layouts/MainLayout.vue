<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-secondary">
      <q-toolbar>
        <q-toolbar-title>
          <b>
            Happy Split
          </b>
        </q-toolbar-title>
        <div class="q-gutter-lg row items-center" v-if="isAuthenticated">
          <q-btn color="secondary" label="Add Expense" />
          <div class="avatar-menu" style="position: relative;">
            <q-avatar>
              <q-avatar>
                <img :src="profileImage || 'https://cdn.quasar.dev/img/avatar.png'" />
              </q-avatar>
            </q-avatar>
            <q-btn class="logout-btn" color="secondary" outline label="Logout" @click="Logout" size="sm"
              style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); display: none;" />
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
    <q-footer class="bg-white text-secondary">
      <q-toolbar>
        <span>© Powered by Tran</span>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const router = useRouter()

const { isAuthenticated, profileImage } = storeToRefs(userStore)

async function Logout() {
  userStore.clearToken()
  await router.push('/login')
}
</script>

<style scoped>
.avatar-menu:hover .logout-btn {
  display: block !important;
}
</style>
