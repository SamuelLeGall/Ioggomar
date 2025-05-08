import { defineStore } from "pinia";
import { ref, Ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
  // specific to the player and not in another store
  const playerLevel: Ref<number> = ref(0);

  return {playerLevel};
});
