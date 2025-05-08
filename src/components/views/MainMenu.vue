<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ libelles("MainMenuMessage.MainMenu.title") }}</h1>
    <p>Player level {{ playerLevel }}</p>
    <button @click="updatePlayerLevel(1)">lvl + 1</button>
    <router-link :to="{ name: 'HELLO_WORLD' }"> HelloWorld </router-link>
    <button disabled>
      {{ libelles("MainMenuMessage.MainMenu.resumeButton") }} (disabled)
    </button>
<!--    <button @click="save">-->
<!--      {{ libelles("MainMenuMessage.MainMenu.saveButton") }}-->
<!--    </button>-->
<!--    <button @click="load">-->
<!--      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}-->
<!--    </button>-->
    <select-change-data
      :options="settingsMapping.game.localization"
      type="localization"
      :sorted="true"
      :multiple="false"
      :model-value="currentLocalization"
      @update:model-value="currentLocalization = $event"
    />
    <select-change-data
      :options="settingsMapping.game.theme"
      type="theme"
      :sorted="true"
      :multiple="false"
      :model-value="currentDataTheme"
      @update:model-value="currentDataTheme = $event"
    />

    <QuestsList />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
// import { save, load } from "@utils/SaveSystem";
import settingsMapping from "@config/mappings/settingsMapping.json";
import SelectChangeData from "@components/UI/UIElements/inputs/Special/SelectChangeData/SelectChangeData.vue";
import QuestsList from "@components/UI/modules/QuestsList.vue";
import { PlayerApiService } from "@src/services/player/PlayerApi.service";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { GameStoreService } from "@src/services/game/GameStore.service";

export default defineComponent({
  name: "MainMenu",
  components: {
    QuestsList,
    SelectChangeData,
  },
  setup() {
    const gameStoreService = new GameStoreService();
    const playerApiService = new PlayerApiService();
    const playerStoreService = new PlayerStoreService();
    const currentLocalization = gameStoreService.getLocalization();
    const currentDataTheme = gameStoreService.getDataTheme();
    const libelles = gameStoreService.getLocalizationLibelle();

    const updatePlayerLevel = (nbLevelsToAdd: number) => {
      playerApiService.updatePlayerLevel(nbLevelsToAdd);
      playerStoreService.syncPlayerLevel();
    };

    const playerLevel = computed(() => {
      return playerStoreService.getPlayerLevel();
    });

    return {
      libelles,
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      playerLevel,
      updatePlayerLevel,
      // save,
      // load,
    };
  },
});
</script>
<style lang="scss" scoped></style>
