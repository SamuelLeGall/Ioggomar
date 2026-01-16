import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { OptionConfig } from "@src/server/models/BasicAndTempModels";
export const useGameStore = defineStore("game", () => {
  const currentLocalization: Ref<OptionConfig> = ref({
    key: "fr-FR",
    value: "Français",
  });
  const currentDataTheme: Ref<OptionConfig> = ref({
    key: "primary",
    value: "primary",
  });

  return {
    currentLocalization,
    currentDataTheme,
  };
});
