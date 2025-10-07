<template>
  <q-header class="bg-white text-secondary">
    <q-toolbar>
      <q-toolbar-title class="cursor-pointer" @click="router.push('/')">
        <b>Happy Split</b>
      </q-toolbar-title>
      <div class="q-gutter-lg row items-center" v-if="isAuthenticated">
        <q-btn color="secondary" label="Add Expense" @click="isAddExpenseDialogDisplay = true" />
        <AddExpenseDialog v-model="isAddExpenseDialogDisplay" />
        <div class="avatar-menu" style="position: relative;">
          <q-avatar>
            <q-avatar>
              <img :src="profileImage" />
            </q-avatar>
          </q-avatar>
          <q-btn class="logout-btn" color="negative" label="Logout" @click="logout" size="sm"
            style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); display: none;" />
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AddExpenseDialog from './Expenses/AddExpenseDialog.vue'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)
const profileImage = computed(() => userStore.profileImage || 'https://cdn.quasar.dev/img/avatar.png')

const router = useRouter()

const isAddExpenseDialogDisplay = ref(false)

async function logout() {
  userStore.clearToken()
  await router.push('/login')
}
</script>

<style scoped>
.avatar-menu:hover .logout-btn {
  display: block !important;
}
</style>
