<template>
  <h1 class="text-center font-bold text-3xl my-2 text-primary">
    You can find me here
  </h1>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div
      v-for="link in links"
      :key="link.title"
      class="relative flex items-center space-x-3 rounded-lg bg-background px-6 py-5 shadow-sm hover:ring-2 hover:ring-primary"
    >
      <div class="w-20 h-10 flex justify-center items-center overflow-hidden">
        <img class="max-h-full max-w-full" :src="link.logo" />
      </div>

      <div class="min-w-0 flex-1">
        <a :href="link.href" class="focus:outline-none">
          <span class="absolute inset-0" aria-hidden="true" />
          <p class="text-3xl font-medium text-center text-white">
            {{ link.title }}
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import twitchLogo from "../assets/twitch.svg";
import youtubeLogo from "../assets/youtube.png";
import xLogo from "../assets/x.svg";
import discordLogo from "../assets/discord.svg";
import githubLogo from "../assets/github.svg";

const links = [
  {
    title: "Twitch",
    href: "https://twitch.tv/nullvt",
    logo: twitchLogo,
  },
  {
    title: "YouTube",
    href: "https://www.youtube.com/@NullVT",
    logo: youtubeLogo,
  },
  {
    title: "Discord",
    href: "https://discord.gg/Nskp76MQCV",
    logo: discordLogo,
  },
  {
    title: "@NullVT_",
    href: "https://x.com/NullVT_",
    logo: xLogo,
  },
  {
    title: "GitHub",
    href: "https://www.youtube.com/@NullVT",
    logo: githubLogo,
  },
];
</script>
