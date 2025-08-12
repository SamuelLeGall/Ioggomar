<template>
  <div>
    <h1>{{ getLabel("ErrorsMessage.PageNotFound.title") }}</h1>
    <p>{{ errorMessage }}</p>
    <router-link :to="{ name: 'MAIN_MENU' }">
      {{ getLabel("ErrorsMessage.PageNotFound.goBackMainMenu") }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
export default defineComponent({
  name: "PageNotFound",
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // STATE

    // STORE
    const settingsStoreService = new SettingsStoreService();

    // METHODS
    const getLabel = (key: string) :string=> {
      return settingsStoreService.getLabel(key);
    }

    return {
      props,
      getLabel,
    };
  },
});
</script>

<style scoped></style>
