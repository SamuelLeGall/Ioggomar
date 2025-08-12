<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ libelles("MainMenuMessage.MainMenu.title") }}</h1>
    <button @click="$emit('new-game')">
      {{ libelles("MainMenuMessage.MainMenu.newButton") }}
    </button>
    <button @click="$emit('resume')">
      {{ libelles("MainMenuMessage.MainMenu.resumeButton") }}
    </button>
    <button @click="$emit('load')">
      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}
    </button>
    <select-change-data
      :options="settingsMapping.game.localization"
      type="localization"
      :sorted="true"
      :multiple="false"
      :model-value="currentLocalization"
      @update:model-value="updateLocalization"
    />
    <select-change-data
      :options="settingsMapping.game.theme"
      type="theme"
      :sorted="true"
      :multiple="false"
      :model-value="currentDataTheme"
      @update:model-value="updateTheme"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import settingsMapping from "@config/mappings/settingsMapping.json";
import SelectChangeData from "@components/UI/UIElements/inputs/Special/SelectChangeData/SelectChangeData.vue";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import { SettingsApiService } from "@src/services/game/SettingsApi.service";
import { OptionConfig } from "@src/models/BasicAndTempModels";
import { update } from "lodash";

export default defineComponent({
  name: "MainMenu",
  components: {
    SelectChangeData,
  },
  emits: ["resume","load","new-game"],
  setup() {
    // API
    const settingsApiService = new SettingsApiService();

    // STORE
    const settingsStoreService = new SettingsStoreService();

    // STATE

    // COMPUTED
    const currentLocalization = computed(() => {
      return settingsStoreService.getLocalization()
    })
    const currentDataTheme = computed(() => {
      return settingsStoreService.getDataTheme()
    })
    const libelles = computed(() => {
      return settingsStoreService.getLocalizationLibelle()
    })

    // METHODS
    const updateLocalization = (value :OptionConfig) =>{
      settingsApiService.changeLocalization(value);
    }

    const updateTheme = (value :OptionConfig) =>{
      settingsApiService.changeTheme(value);
    }


    // HOOKS

    return {
      libelles,
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      updateLocalization,
      updateTheme,
    };
  },
  methods: { update },
});
</script>
<style lang="scss" scoped></style>
