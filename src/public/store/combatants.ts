import { defineStore } from "pinia";
import { ref } from "vue";
import { Combatant } from "@src/server/models/entitiesStats/CombatantModels";

export const useCombatantsStore = defineStore("combatants", () => {
  const combatants = ref<Combatant[]>([]);

  return { combatants };
});
