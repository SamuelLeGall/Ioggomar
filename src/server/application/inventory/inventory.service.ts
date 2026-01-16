import {
  ErrorFactory,
  FrontendResult,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { InventoryUI } from "@src/models/inventory/inventory.frontend.model";
import { InventoryRepository } from "@src/server/infrastructure/repositories/Inventory/InventoryRepository";
import { toInventoryForFrontend } from "@src/server/domain/mappers/InventoryMappers";
import { ItemRepository } from "@src/server/infrastructure/repositories/Inventory/ItemRepository";
import { ItemEntity } from "@src/server/domain/entities/ItemEntity";
import { ActiveItem } from "@src/models/inventory/inventory.db.model";
import { InventoryEntity } from "@src/server/domain/entities/InventoryEntity";
import * as generalUtils from "@utils/GeneralUtils";

export class InventoryService {
  private readonly instanceName = "InventoryService";
  private readonly inventoryRepo: InventoryRepository;
  private readonly itemRepo: ItemRepository;
  constructor(
    inventoryRepo: InventoryRepository = new InventoryRepository(),
    itemRepo = new ItemRepository(),
  ) {
    this.inventoryRepo = inventoryRepo;
    this.itemRepo = itemRepo;
  }

  /** Business Logic - It represent use cases or actions that the player can perform **/

  /** GETTERS */
  private getItemById(itemId: string): Result<ItemEntity> {
    return this.itemRepo.getById(itemId);
  }
  private generateItemEntitiesForInventory(
    items: ActiveItem[],
  ): Result<ItemEntity[]> {
    const result: ItemEntity[] = [];
    items.forEach((item) => {
      const resultGetItem = this.getItemById(item.itemId);
      if (ResultFactory.isError(resultGetItem)) {
        const [, errorGetItem] = resultGetItem;
        return [
          null,
          ErrorFactory.chainError(
            errorGetItem,
            ErrorFactory.createContext(
              "Service",
              "generateItemEntitiesForInventory",
              {
                itemId: item.itemId,
                instanceName: this.instanceName,
              },
            ),
          ),
        ];
      }
      const [itemEntity] = resultGetItem;
      result.push(itemEntity);
    });

    return [result, null];
  }

  public getAllInventories(): FrontendResult<InventoryUI[]> {
    try {
      const resultGetInventories = this.inventoryRepo.getAll();
      if (ResultFactory.isError(resultGetInventories)) {
        const [, errorGetInventories] = resultGetInventories;
        errorGetInventories.logToConsole();
        return [null, errorGetInventories.getPublicMessage()];
      }
      const [inventories] = resultGetInventories;

      const inventoriesFrontend: InventoryUI[] = [];
      for (const inventory of inventories) {
        const resultGetItems = this.generateItemEntitiesForInventory(
          inventory.getItems(),
        );
        if (ResultFactory.isError(resultGetItems)) {
          const [, errorGetItems] = resultGetItems;
          errorGetItems.logToConsole();
          return [null, errorGetItems.getPublicMessage()];
        }
        const [itemEntities] = resultGetItems;

        const resultMapFrontend = toInventoryForFrontend(
          inventory,
          itemEntities,
        );
        if (ResultFactory.isError(resultMapFrontend)) {
          const [, errorMapFrontend] = resultMapFrontend;
          errorMapFrontend.logToConsole();
          return [null, errorMapFrontend.getPublicMessage()];
        }
        const [inventoryForFrontend] = resultMapFrontend;
        inventoriesFrontend.push(inventoryForFrontend);
      }

      return [inventoriesFrontend, null];
    } catch (e) {
      console.error("getAllInventories - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public getInventoryById(inventoryId: string): FrontendResult<InventoryUI> {
    try {
      const resultGetInventory = this.inventoryRepo.getById(inventoryId);
      if (ResultFactory.isError(resultGetInventory)) {
        const [, errorGetInventory] = resultGetInventory;
        errorGetInventory.logToConsole();
        return [null, errorGetInventory.getPublicMessage()];
      }
      const [inventory] = resultGetInventory;

      const resultGetItems = this.generateItemEntitiesForInventory(
        inventory.getItems(),
      );
      if (ResultFactory.isError(resultGetItems)) {
        const [, errorGetItems] = resultGetItems;
        errorGetItems.logToConsole();
        return [null, errorGetItems.getPublicMessage()];
      }
      const [itemEntities] = resultGetItems;

      const resultMapFrontend = toInventoryForFrontend(inventory, itemEntities);
      if (ResultFactory.isError(resultMapFrontend)) {
        const [, errorMapFrontend] = resultMapFrontend;
        errorMapFrontend.logToConsole();
        return [null, errorMapFrontend.getPublicMessage()];
      }
      const [inventoryFrontend] = resultMapFrontend;

      return [inventoryFrontend, null];
    } catch (e) {
      console.error("getInventoryById - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  /** MUTATIONS */
  private getSelectedItemsFromInventory(
    inventory: InventoryEntity,
    itemsToTransferIds: string[],
  ): Result<ActiveItem[]> {
    const result: ActiveItem[] = [];
    itemsToTransferIds.forEach((itemUUID) => {
      const item = inventory.getItemByUUID(itemUUID);
      if (!item) {
        return [
          null,
          ErrorFactory.unexpectedError(
            ErrorFactory.createContext(
              "Service",
              "getSelectedItemsFromInventory",
              {
                inventoryId: inventory.getId(),
                itemUUID,
                items: inventory.getItems(),
                instanceName: this.instanceName,
              },
            ),
            new Error("Could not find the wanted item in this inventory"),
          ),
        ];
      }
      result.push(item);
    });

    return [result, null];
  }

  public transferItems(
    sourceInventoryId: string,
    targetInventoryId: string,
    itemsToTransferIds: { id: string; quantityToTransfer?: number }[],
  ): FrontendResult<boolean> {
    // fetch the item to transfert from the source inventory
    const resultGetSourceInventory =
      this.inventoryRepo.getById(sourceInventoryId);
    if (ResultFactory.isError(resultGetSourceInventory)) {
      const [, errorGetSourceInventory] = resultGetSourceInventory;
      errorGetSourceInventory.logToConsole();
      return [null, errorGetSourceInventory.getPublicMessage()];
    }
    const [sourceInventory] = resultGetSourceInventory;

    const resultGetItems = this.getSelectedItemsFromInventory(
      sourceInventory,
      itemsToTransferIds.map((el) => el.id),
    );
    if (ResultFactory.isError(resultGetItems)) {
      const [, errorGetItems] = resultGetItems;
      errorGetItems.logToConsole();
      return [null, errorGetItems.getPublicMessage()];
    }
    const [items] = resultGetItems;

    // fetch the target Repo
    const resultGetTargetInventory =
      this.inventoryRepo.getById(targetInventoryId);
    if (ResultFactory.isError(resultGetTargetInventory)) {
      const [, errorGetInventory] = resultGetTargetInventory;
      errorGetInventory.logToConsole();
      return [null, errorGetInventory.getPublicMessage()];
    }
    const [targetInventory] = resultGetTargetInventory;

    items.forEach((item) => {
      const config = itemsToTransferIds.find((el) => el.id === item.id);
      if (
        !config ||
        (config.quantityToTransfer && config.quantityToTransfer > item.quantity)
      ) {
        return;
      }
      const quantityToTransfer = config.quantityToTransfer ?? item.quantity;

      // add the item to the target inventory
      targetInventory.addItem({
        ...item,
        id: generalUtils.generateUUID(),
        quantity: quantityToTransfer,
      });

      // update or remove the items from the source inventory
      if (sourceInventory.shouldItemBeRemoved(item.id, quantityToTransfer)) {
        sourceInventory.deleteItem(item.id);
      } else {
        const newValue: ActiveItem = {
          ...item,
          quantity: item.quantity - quantityToTransfer,
        };
        sourceInventory.updateItem(item.id, newValue);
      }
    });

    // save both inventory
    const resultSaveSource = this.inventoryRepo.save(sourceInventory);
    if (ResultFactory.isError(resultSaveSource)) {
      const [, errorSaveSource] = resultSaveSource;
      errorSaveSource.logToConsole();
      return [null, errorSaveSource.getPublicMessage()];
    }

    const resultSaveTarget = this.inventoryRepo.save(targetInventory);
    if (ResultFactory.isError(resultSaveTarget)) {
      const [, errorSaveTarget] = resultSaveTarget;
      errorSaveTarget.logToConsole();
      return [null, errorSaveTarget.getPublicMessage()];
    }

    return [true, null];
  }

  public splitItem(
    inventoryId: string,
    itemToSplitId: string,
  ): FrontendResult<boolean> {
    const resultGetInventory = this.inventoryRepo.getById(inventoryId);
    if (ResultFactory.isError(resultGetInventory)) {
      const [, errorGetInventory] = resultGetInventory;
      errorGetInventory.logToConsole();
      return [null, errorGetInventory.getPublicMessage()];
    }
    const [inventory] = resultGetInventory;

    inventory.splitItem(itemToSplitId);

    const resultSaveSource = this.inventoryRepo.save(inventory);
    if (ResultFactory.isError(resultSaveSource)) {
      const [, errorSaveSource] = resultSaveSource;
      errorSaveSource.logToConsole();
      return [null, errorSaveSource.getPublicMessage()];
    }

    return [true, null];
  }
  public deleteItems(
    inventoryId: string,
    itemsToDeleteIds: string[],
  ): FrontendResult<boolean> {
    const resultGetInventory = this.inventoryRepo.getById(inventoryId);
    if (ResultFactory.isError(resultGetInventory)) {
      const [, errorGetInventory] = resultGetInventory;
      errorGetInventory.logToConsole();
      return [null, errorGetInventory.getPublicMessage()];
    }
    const [inventory] = resultGetInventory;

    inventory.deleteItems(itemsToDeleteIds);

    const resultSaveSource = this.inventoryRepo.save(inventory);
    if (ResultFactory.isError(resultSaveSource)) {
      const [, errorSaveSource] = resultSaveSource;
      errorSaveSource.logToConsole();
      return [null, errorSaveSource.getPublicMessage()];
    }

    return [true, null];
  }

  public initializeInventories(): Result<true> {
    try {
      const resultRestoreDefaultInventories =
        this.inventoryRepo.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefaultInventories)) {
        const [, errorRestoreInventories] = resultRestoreDefaultInventories;
        return [
          null,
          ErrorFactory.chainError(
            errorRestoreInventories,
            ErrorFactory.createContext("Service", "initializeInventories", {
              instanceName: this.instanceName,
              restoreKO: "inventoryRepo",
            }),
          ),
        ];
      }

      const resultRestoreDefaultItems = this.itemRepo.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefaultItems)) {
        const [, errorRestoreItems] = resultRestoreDefaultItems;
        return [
          null,
          ErrorFactory.chainError(
            errorRestoreItems,
            ErrorFactory.createContext("Service", "initializeInventories", {
              instanceName: this.instanceName,
              restoreKO: "itemRepo",
            }),
          ),
        ];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "initializeSettings", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
