<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ libelles("MainMenuMessage.MainMenu.title") }}</h1>
    <button @click="newGame">
      {{ libelles("MainMenuMessage.MainMenu.newButton") }}
    </button>
    <button @click="resumeGame">
      {{ libelles("MainMenuMessage.MainMenu.resumeButton") }}
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
import { defineComponent, onBeforeMount, ref } from "vue";
import settingsMapping from "@config/mappings/settingsMapping.json";
import SelectChangeData from "@components/UI/UIElements/inputs/Special/SelectChangeData/SelectChangeData.vue";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import { GameContextApiService } from "@src/services/game/GameContextApi.service";
import { useRouter } from "vue-router";
import { PlayerStoreService } from "@src/services/player/PlayerStore.service";
import { QuestStoreService } from "@src/services/quests/QuestStore.service";

export default defineComponent({
  name: "MainMenu",
  components: {
    SelectChangeData,
  },
  setup() {
    // COMPOSABLES
    const router = useRouter()

    // API
    const gameApiService = new GameContextApiService();

    // STORE
    const settingsStoreService = new SettingsStoreService();
    const playerStoreService = new PlayerStoreService();
    const questStoreService = new QuestStoreService();

    // STATE
    const currentLocalization = ref();
    const currentDataTheme = ref();
    const libelles = ref();

    // METHODS
    const goToTestGround = ()=>{
      router.push({
        name: 'TEST_GROUND',
      })
    }
    const load = async () => {
      const succeess = await gameApiService.load();
      if (succeess) {
        settingsStoreService.syncLocalization();
        settingsStoreService.syncTheme();
        playerStoreService.syncPlayer();
        questStoreService.syncAllActiveQuests();
        questStoreService.syncAllQuests();
      }
    }
    const newGame = () =>{
      gameApiService.initialize();
      goToTestGround();
    }
    const resumeGame = () =>{
      gameApiService.resume();
      goToTestGround();
    }

    // HOOKS
    onBeforeMount(()=>{
      settingsStoreService.syncLocalization();
      settingsStoreService.syncTheme();
      currentLocalization.value = settingsStoreService.getLocalization();
      currentDataTheme.value = settingsStoreService.getDataTheme();
      libelles.value = settingsStoreService.getLocalizationLibelle();
    })

    return {
      libelles,
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      load,
      resumeGame,
      newGame
    };
  },
});
</script>
<style lang="scss" scoped></style>
