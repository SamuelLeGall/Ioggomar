<template>
  <div class="hello-world-main-container">
    <p>Player level {{ playerLevel }}</p>
    <router-link :to="{ name: 'TEST_GROUND' }"> MainMenu </router-link>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onBeforeMount } from "vue";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    // STORE
    const playerStoreService = new PlayerStoreService();

    // COMPUTED
    const playerLevel = computed(() => {
      return playerStoreService.getPlayer().level;
    });

    // HOOKS
    onBeforeMount(() => {
      playerStoreService.syncPlayer();
    });
    return {
      playerLevel,
    };
  },
});
</script>
