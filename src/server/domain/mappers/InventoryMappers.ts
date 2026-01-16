import {
  InventoryItemUI,
  InventoryUI,
} from "@src/server/models/inventory/inventory.frontend.model";
import { ErrorFactory, Result } from "@src/server/models/BasicAndTempModels";
import { InventoryEntity } from "@src/server/domain/entities/InventoryEntity";
import { ActiveItem } from "@src/server/models/inventory/inventory.db.model";
import { ItemEntity } from "@src/server/domain/entities/ItemEntity";

export function toInventoryForFrontend(
  inventoryEntity: InventoryEntity,
  itemEntities: ItemEntity[],
): Result<InventoryUI> {
  try {
    const inventory: InventoryUI = {
      id: inventoryEntity.getId(),
      data: [],
    };
    const activeItems: ActiveItem[] = inventoryEntity.getItems();

    activeItems.forEach((activeItem: ActiveItem) => {
      const item = itemEntities.find((el) => el.getId() === activeItem.itemId);
      if (!item) {
        return [
          null,
          ErrorFactory.unexpectedError(
            ErrorFactory.createContext("Mapper", "toInventoryForFrontend", {
              uuid: activeItem.id,
              itemId: activeItem.itemId,
              itemEntities,
            }),
            new Error("Could not find any item for this id"),
          ),
        ];
      }

      const itemUI: InventoryItemUI = {
        id: activeItem.id,
        name: item.getName(),
        description: item.getDescription(),
        image: item.getImage(),
        quantity: activeItem.quantity,
        price: item.getPrice(),
        rarity: item.getRarity(),
        // TODO
        tracking: { isRecyclabledIntoTracked: false, isTracked: false },
        tags: [],
        hints: {
          source: item.getSourceHints(),
          use: item.getUseHints(),
        },
        stackSize: item.getStackSize(),
      };
      item.getTags().forEach((tagId: string) => {
        // TODO
        itemUI.tags.push({
          id: tagId,
          type: "TEXT",
          text: `${tagId}.text`,
        });
      });
      inventory.data.push(itemUI);
    });

    return [inventory, null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toInventoryForFrontend", {}),
        e,
      ),
    ];
  }
}
