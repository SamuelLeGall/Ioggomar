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
import SelectComponent from "@components/UIElements/inputs/Select/SelectComponent.vue";
import { OptionConfig } from "@models/BasicAndTempModels";
import { GameService } from "@src/domain/services/GameService";

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
    const gameService  = new GameService();

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
      gameService.changeLocalization(newLocalization)
    };

    const changeTheme = async (newTheme: OptionConfig) => {
      gameService.changeTheme(newTheme)
      document.documentElement.setAttribute("data-theme", newTheme.key);
    };

    return {
      changeData,
      props,
    };
  },
});
</script>
