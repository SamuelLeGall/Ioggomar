<template>
  <div class="hello-world-main-container">
    <p>Player level</p>
    <router-link :to="{ name: 'MAIN_MENU' }"> MainMenu </router-link>
  </div>
</template>
<script lang="ts">
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    return {};
  },
});
</script>
