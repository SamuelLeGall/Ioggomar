<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <p>Player level {{ playerLevel }}</p>
    <button @click="updatePlayerLevel(1)">lvl + 1</button>
    <hr />
    <router-link :to="{ name: 'HELLO_WORLD' }"> HelloWorld </router-link>

    <button @click="save">
      {{ libelles("MainMenuMessage.MainMenu.saveButton") }}
    </button>
    <button @click="load">
      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}
    </button>
    <hr />
    <QuestsList />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import QuestsList from "@components/UI/modules/QuestsList.vue";
import { PlayerApiService } from "@src/services/player/PlayerApi.service";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import { GameContextApiService } from "@src/services/game/GameContextApi.service";
import { GameContextStoreService } from "@src/services/game/GameContextStore.service";

export default defineComponent({
  name: "MainMenu",
  components: {
    QuestsList,
  },
  setup() {
    // API
    const playerApiService = new PlayerApiService();
    const gameApiService = new GameContextApiService();

    // STORE
    const settingsStoreService = new SettingsStoreService();
    const playerStoreService = new PlayerStoreService();
    const gameContextStoreService = new GameContextStoreService()

    // STATE

    // METHODS
    const updatePlayerLevel = (nbLevelsToAdd: number) => {
      playerApiService.levelUp(nbLevelsToAdd);
      playerStoreService.syncPlayer();
    };

    const save = async () => {
      await gameApiService.save();
    };
    const load = async () => {
      const success = await gameApiService.load();
      if (success) {
        gameContextStoreService.initialSyncAfterLoad()
      }
    };

    // COMPUTED
    const libelles = computed(() => {
      return settingsStoreService.getLocalizationLibelle();
    })

    const playerLevel = computed(() => {
      return playerStoreService.getPlayer().level;
    });

    // HOOKS
    onBeforeMount(() => {
      gameContextStoreService.initialSyncAfterLoad()
    });

    return {
      libelles,
      playerLevel,
      updatePlayerLevel,
      save,
      load,
    };
  },
});
</script>
<style lang="scss" scoped></style>
