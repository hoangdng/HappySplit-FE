<template>
  <q-layout view="lHh Lpr lFf" >
    <TheHeader />
    <q-page-container class="bg-image">
      <div class="column justify-start items-center q-py-md">
        <router-view style="opacity: 0.9;"/>
      </div>
    </q-page-container>
    <TheFooter />
  </q-layout>
</template>

<script setup lang="ts">
import TheHeader from 'src/components/TheHeader.vue'
import TheFooter from 'src/components/TheFooter.vue';
</script>

<style>
.bg-image {
  background-image: url('/images/bg-image.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
