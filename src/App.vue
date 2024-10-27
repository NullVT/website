<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
    <Twitch />
    <Schedule />
    <Links />
  </div>
</template>

<script setup lang="ts">
import Links from "./components/links.vue";
import Schedule from "./components/schedule.vue";
import Twitch from "./components/twitch.vue";
</script>
