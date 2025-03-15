<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ libelles("MainMenuMessage.MainMenu.title") }}</h1>
<!--    <p>Player level {{ playerLvl }}</p>-->
<!--    <button @click="playerLvlUp(1)">lvl + 1</button>-->
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
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { save, load } from "@utils/SaveSystem";
import settingsMapping from "@config/mappings/settingsMapping.json";
import SelectChangeData from "@components/UIElements/inputs/Special/SelectChangeData/SelectChangeData.vue";
import { GameService } from "@src/domain/services/GameService";

export default defineComponent({
  name: "MainMenu",
  components: {
    SelectChangeData,
  },
  setup() {
    const gameService  = new GameService();
    const currentLocalization = gameService.getCurrentLocalization();
    const currentDataTheme = gameService.getCurrentTheme();
    const libelles = gameService.getCurrentLocalizationLibelles();


    return {
      libelles,
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      save,
      load,
    };
  },
});
</script>
<style lang="scss" scoped>
#main-menu-container {
  background-color: aqua;
}
#main-menu-container > * {
  background-color: rebeccapurple;
}
</style>
