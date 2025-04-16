<template>
  <div class="hello-world-main-container">
    <p>Player level {{ playerLevel }}</p>
    <router-link :to="{ name: 'MAIN_MENU' }"> MainMenu </router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PlayerService } from "@src/server/services/PlayerService";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const playerService = new PlayerService();
    const playerLevel = playerService.getPlayerLevel();
    return {
      playerLevel,
    };
  },
});
</script>
