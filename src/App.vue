<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { GameStoreService } from "@src/services/game/GameStore.service";

onMounted(()=>{

  const gameStoreService = new GameStoreService();
  const playerStoreService = new PlayerStoreService();

  gameStoreService.syncLocalization();
  gameStoreService.syncTheme();
  playerStoreService.syncPlayer();
})
</script>