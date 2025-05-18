<template>
  <div class="hello-world-main-container">
    <p>Player level {{ playerLevel }}</p>
    <router-link :to="{ name: 'MAIN_MENU' }"> MainMenu </router-link>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const playerService = new PlayerStoreService();
    const playerLevel = computed(() => {
      return playerService.getPlayer().level;
    });
    return {
      playerLevel,
    };
  },
});
</script>
