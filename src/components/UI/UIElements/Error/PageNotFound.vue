<template>
  <div>
    <h1>{{ libelles("ErrorsMessage.PageNotFound.title") }}</h1>
    <p>{{ errorMessage }}</p>
    <router-link :to="{ name: 'MAIN_MENU' }">
      {{ libelles("ErrorsMessage.PageNotFound.goBackMainMenu") }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GameService } from "@src/server/services/GameService";

export default defineComponent({
  name: "PageNotFound",
  props: {
    errorMessage: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const libelles = new GameService().getCurrentLocalizationLibelles()
    return {
      props,
      libelles,
    };
  },
});
</script>

<style scoped></style>
