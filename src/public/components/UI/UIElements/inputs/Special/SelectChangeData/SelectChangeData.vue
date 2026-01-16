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
import { defineComponent, PropType } from "vue";
import { OptionConfig } from "@src/server/models/BasicAndTempModels";
import { SettingsApiService } from "@src/public/services/game/SettingsApi.service";
import SelectComponent from "@src/public/components/UI/UIElements/inputs/Select/SelectComponent.vue";

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
  setup(props, { emit }) {
    // STATE

    // COMPOSABLES
    const settingsApiService = new SettingsApiService();

    // METHODS
    const changeData = (option: OptionConfig) => {
      switch (props.type) {
        case "localization":
          settingsApiService.changeLocalization(option);
          break;
        case "theme":
          settingsApiService.changeTheme(option);
          break;
        default:
          break;
      }
      // we update the model
      emit("update:model-value", option);
    };

    return {
      changeData,
      props,
    };
  },
});
</script>
