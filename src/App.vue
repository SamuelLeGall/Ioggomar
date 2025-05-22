<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";

onMounted(()=>{

  const settingsStoreService = new SettingsStoreService();
  const playerStoreService = new PlayerStoreService();

  settingsStoreService.syncLocalization();
  settingsStoreService.syncTheme();
  playerStoreService.syncPlayer();
})
</script>