import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { OptionConfig } from "@src/models/BasicAndTempModels";
export const useGameStore = defineStore("game", () => {
  const currentLocalization: Ref<OptionConfig> = ref({
    key: "fr_FR",
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
