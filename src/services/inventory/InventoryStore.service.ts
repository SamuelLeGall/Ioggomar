import { InventoryApiService } from "@src/services/inventory/InventoryApi.service";
import { useInventoryStore } from "@src/store/inventory";
import { InventoryUI } from "@src/models/inventory/inventory.frontend.model";

export class InventoryStoreService {
  private store;
  private api: InventoryApiService;

  constructor(store = useInventoryStore(), api = new InventoryApiService()) {
    this.store = store;
    this.api = api;
  }

  getAllInventories = (): InventoryUI[] => {
    return this.store.listInventories;
  };
  getInventoryById = (inventoryId: string): InventoryUI | undefined => {
    return this.getAllInventories().find((el) => el.id === inventoryId);
  };
  getInventoryIndexById = (questId: string): number => {
    return this.getAllInventories().findIndex((el) => el.id === questId);
  };

  syncInventoryById = (inventoryId: string): void => {
    const inventoryUpdated = this.api.getInventoryById(inventoryId);
    if (!inventoryUpdated) {
      // quest not found in backend
      return;
    }

    const index = this.getInventoryIndexById(inventoryId);
    if (index === -1) {
      // inventory not found in the store, we add it.
      this.store.listInventories.push(inventoryUpdated);
      return;
    }

    // we update the existing inventory in the store
    this.store.listInventories[index] = inventoryUpdated;
  };

  syncAllInventories = (): void => {
    this.store.listInventories = [];
    const inventories = this.api.getAllInventories();
    if (!inventories) {
      return;
    }

    for (const inventory of inventories) {
      this.syncInventoryById(inventory.id);
    }
  };

  public refreshAllInventories = (): void => {
    this.syncAllInventories();
  };
}
