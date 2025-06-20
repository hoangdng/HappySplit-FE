<template>
  <q-page class="column justify-start items-center q-py-md">
    <q-card class="bg-white text-black q-pa-md" style="max-width: 600px; width: 100%;">
      <q-card-section class="text-h6">
        Invitation Accepted
      </q-card-section>
      <q-card-section>
        <p>Thank you for accepting the invitation to join the group!</p>
        <p>You can now start collaborating with your group members.</p>
      </q-card-section>
      <q-btn color="secondary" flat label="Go to Group" @click="$router.push(`/groups/${groupId}`)" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useUserStore } from 'src/stores/user'
import { onMounted } from 'vue'


const route = useRoute()
const groupId = route.params.id
const userStore = useUserStore()

const user = userStore.getUserInfoFromToken;

onMounted(async () => {
  await api.post(`/api/groups/${String(groupId)}/invitation-accepted`, {
    inviteeEmail: user!.email,
    inviteeName: user!.name,
    token: route.query.token
  })
})

</script>
