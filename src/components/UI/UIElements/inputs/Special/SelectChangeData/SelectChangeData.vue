<template>
  <div class="container">
    <select-component
      :options="options"
      :model-value="modelValue"
      :sorted="sorted"
      :multiple="multiple"
      @update:model-value="changeData($event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";
import { OptionConfig } from "@src/models/BasicAndTempModels";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import { SettingsApiService } from "@src/services/game/SettingsApi.service";
import SelectComponent from "@components/UI/UIElements/inputs/Select/SelectComponent.vue";

export default defineComponent({
  name: "SelectChangeData",
  components: { SelectComponent },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Object as PropType<Array<OptionConfig> | OptionConfig>,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "",
    },
    options: {
      type: Object as PropType<Array<OptionConfig>>,
      required: true,
    },
    sorted: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:model-value"],
  setup(props: any, { emit }: any) {
    // STORE
    const settingsStoreService  = new SettingsStoreService();
    const settingsApiService  = new SettingsApiService();

    // METHODS
    const changeData = (option: OptionConfig) => {
      switch (props.type) {
        case "localization":
          changeLocalization(option);
          break;
        case "theme":
          changeTheme(option);
          break;
        default:
          break;
      }
      // we update the model
      emit("update:model-value", option);
    };

    const changeLocalization = async (newLocalization: OptionConfig) => {
      settingsApiService.changeLocalization(newLocalization)
      settingsStoreService.syncLocalization();
    };

    const changeTheme = async (newTheme: OptionConfig) => {
      settingsApiService.changeTheme(newTheme)
      settingsStoreService.syncTheme();
    };

    return {
      changeData,
      props,
    };
  },
});
</script>
