import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import { InventoryUI } from "@src/models/inventory/inventory.frontend.model";

export const useInventoryStore = defineStore("inventory", () => {
  const listInventories: Ref<InventoryUI[]> = ref<InventoryUI[]>([]);

  return { listInventories };
});
