<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <p>Player level {{ playerLevel }}</p>
    <button @click="updatePlayerLevel(1)">lvl + 1</button>
    <hr />
    <router-link :to="{ name: 'HELLO_WORLD' }"> HelloWorld </router-link>

    <button @click="$emit('save')">
      {{ libelles("MainMenuMessage.MainMenu.saveButton") }}
    </button>
    <button @click="$emit('load')">
      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}
    </button>
    <hr />
    <QuestsList />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import QuestsList from "@components/UI/modules/QuestsList.vue";
import { PlayerApiService } from "@src/services/player/PlayerApi.service";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";

export default defineComponent({
  name: "MainMenu",
  components: {
    QuestsList,
  },
  emits: ["save", "load"],
  setup() {
    // API
    const playerApiService = new PlayerApiService();

    // STORE
    const settingsStoreService = new SettingsStoreService();
    const playerStoreService = new PlayerStoreService();

    // STATE

    // METHODS
    const updatePlayerLevel = (nbLevelsToAdd: number) => {
      playerApiService.levelUp(nbLevelsToAdd);
      playerStoreService.syncPlayer();
    };

    // COMPUTED
    const libelles = computed(() => {
      return settingsStoreService.getLocalizationLibelle();
    });

    const playerLevel = computed(() => {
      return playerStoreService.getPlayer().level;
    });

    return {
      libelles,
      playerLevel,
      updatePlayerLevel,
    };
  },
});
</script>
<style lang="scss" scoped></style>
