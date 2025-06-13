<template>
  <q-page class="row items-center justify-center">
    <div id="g_id_signin"></div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useUserStore } from 'src/stores/user'

const router = useRouter()
const userStore = useUserStore();

// Handles the ID token returned from Google
async function handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
  try {
    const { data } = await api.post('/api/auth/google-login', {
      idToken: response.credential
    })

    // Decode JWT to get profile info
    const payloadBase64 = response.credential.replace(/-/g, '+').replace(/_/g, '/').split('.')[1];
    console.log('Decoded JWT Payload:', payloadBase64);
    if (typeof payloadBase64 == 'string') {
      const profile = JSON.parse(atob(payloadBase64));
      if (profile && profile.picture) {
        userStore.setProfileImage(profile.picture)
      }
    }

    // Save your app's JWT token locally
    userStore.setToken(data.token)

    // Redirect to dashboard or home
    await router.push('/')
  } catch (err) {
    console.error('Login failed', err)
  }
}

onMounted(async () => {
  // If already authenticated, redirect to home
  if (userStore.isAuthenticated) {
    await router.push('/')
  }

  window.google?.accounts.id.initialize({
    client_id: "1084612091907-lbrng5g8ia4necssnma7i4tliv618647.apps.googleusercontent.com",
    callback: (response) => void handleCredentialResponse(response),
  })

  const el = document.getElementById('g_id_signin')
  if (el) {
    window.google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'rectangular',
      text: 'signin_with',
    })
  }
})
</script>
