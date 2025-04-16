<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ libelles("MainMenuMessage.MainMenu.title") }}</h1>
    <p>Player level {{ playerLevel }}</p>
    <button @click="updatePlayerLevel(1)">lvl + 1</button>
    <router-link :to="{ name: 'HELLO_WORLD' }"> HelloWorld </router-link>
    <button>
      {{ libelles("MainMenuMessage.MainMenu.resumeButton") }}
    </button>
    <button @click="save">
      {{ libelles("MainMenuMessage.MainMenu.saveButton") }}
    </button>
    <button @click="load">
      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}
    </button>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { save, load } from "@utils/SaveSystem";
import settingsMapping from "@config/mappings/settingsMapping.json";
import SelectChangeData from "@components/UI/UIElements/inputs/Special/SelectChangeData/SelectChangeData.vue";
import { GameService } from "@src/server/services/GameService";
import { PlayerService } from "@src/server/services/PlayerService";

export default defineComponent({
  name: "MainMenu",
  components: {
    SelectChangeData,
  },
  setup() {
    const gameService = new GameService();
    const playerService = new PlayerService();
    const currentLocalization = gameService.getCurrentLocalization();
    const currentDataTheme = gameService.getCurrentTheme();
    const libelles = gameService.getCurrentLocalizationLibelles();

    const updatePlayerLevel = (nbLevelsToAdd: number) => {
      playerService.updatePlayerLevel(nbLevelsToAdd);
    };

    const playerLevel = computed(()=>{
      return playerService.getPlayerLevel();
    })

    return {
      libelles,
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      playerLevel,
      updatePlayerLevel,
      save,
      load,
    };
  },
});
</script>
<style lang="scss" scoped></style>
