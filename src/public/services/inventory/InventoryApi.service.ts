import { useToast } from "vue-toast-notification";
import { ResultFactory } from "@src/server/models/BasicAndTempModels";
import { InventoryService } from "@src/server/application/inventory/inventory.service";
import { InventoryUI } from "@src/server/models/inventory/inventory.frontend.model";
export class InventoryApiService {
  private backendService: InventoryService;
  private toast;

  constructor(backendService = new InventoryService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
    this.toast = useToast({
      position: "top-right",
      duration: 1500,
    });
  }

  /** GETTERS */

  getAllInventories = (): InventoryUI[] | undefined => {
    const result = this.backendService.getAllInventories();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [inventories] = result;
    return inventories;
  };
  getInventoryById = (questId: string): InventoryUI | undefined => {
    const result = this.backendService.getInventoryById(questId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [inventory] = result;
    return inventory;
  };

  /** MUTATIONS */
  transfer = (
    sourceInventoryId: string,
    targetInventoryId: string,
    itemsToTransferIds: { id: string; quantityToTransfer?: number }[],
  ): boolean => {
    const result = this.backendService.transferItems(
      sourceInventoryId,
      targetInventoryId,
      itemsToTransferIds,
    );
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;

    return Boolean(success);
  };
  split = (inventoryId: string, itemToSplitId: string): boolean => {
    const result = this.backendService.splitItem(inventoryId, itemToSplitId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;

    return Boolean(success);
  };
  delete = (inventoryId: string, itemsToDeleteIds: string[]): boolean => {
    const result = this.backendService.deleteItems(
      inventoryId,
      itemsToDeleteIds,
    );
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;

    return Boolean(success);
  };
}
