import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayerUI } from "@src/server/models/player/player.frontend.model";

export const usePlayerStore = defineStore("player", () => {
  // specific to the player and not in another store
  const player = ref<PlayerUI>({
    level: 0,
  });

  return { player };
});
