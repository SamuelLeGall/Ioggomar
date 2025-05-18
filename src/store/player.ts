import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayerForFrontend } from "@src/models/player/PlayerModels";

export const usePlayerStore = defineStore("player", () => {
  // specific to the player and not in another store
  const player = ref<PlayerForFrontend>({
    level:0
  });

  return { player };
});
