<template>
  <div v-if="isLive">
    <h1 class="text-center font-bold text-3xl text-twitch my-2">
      <a :href="`https://twitch.tv/${channel}`" target="_blank">
        Currently Live!
      </a>
    </h1>
    <div class="aspect-video bg-twitch rounded-lg">
      <iframe
        :src="`https://player.twitch.tv/?channel=${channel}&parent=${location}`"
        frameborder="0"
        allowfullscreen="true"
        scrolling="no"
        height="100%"
        width="100%"
        class="rounded-lg"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const channel = "nullvt";
const isLive = ref(true);
const location = window.location.hostname;

const checkTwitchLive = async () => {
  return (isLive.value = true);
};

onMounted(() => {
  checkTwitchLive();
});
</script>
