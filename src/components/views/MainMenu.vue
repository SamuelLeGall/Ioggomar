<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <h1>{{ getLabel("MainMenuMessage.MainMenu.title") }}</h1>
    <button @click="$emit('new-game')">
      {{ getLabel("MainMenuMessage.MainMenu.newButton") }}
    </button>
    <button @click="$emit('resume')">
      {{ getLabel("MainMenuMessage.MainMenu.resumeButton") }}
    </button>
    <button @click="$emit('load')">
      {{ getLabel("MainMenuMessage.MainMenu.loadButton") }}
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

export default defineComponent({
  name: "MainMenu",
  components: {
    SelectChangeData,
  },
  emits: ["resume", "load", "new-game"],
  setup() {
    // STORE
    const settingsStoreService = new SettingsStoreService();

    // STATE

    // COMPUTED
    const currentLocalization = computed(() => {
      return settingsStoreService.getLocalization();
    });
    const currentDataTheme = computed(() => {
      return settingsStoreService.getDataTheme();
    });

    // METHODS
    const getLabel = (key: string): string => {
      return settingsStoreService.getLabel(key);
    };

    const updateLocalization = () => {
      settingsStoreService.syncLocalization();
    };

    const updateTheme = () => {
      settingsStoreService.syncTheme();
    };

    // HOOKS

    return {
      settingsMapping,
      currentLocalization,
      currentDataTheme,
      updateLocalization,
      updateTheme,
      getLabel,
    };
  },
});
</script>
<style lang="scss" scoped></style>
