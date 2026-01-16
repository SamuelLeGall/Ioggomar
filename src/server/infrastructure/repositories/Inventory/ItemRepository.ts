import { BaseCollectionRepository } from "@src/server/infrastructure/repositories/BaseCollectionRepository";
import { Item } from "@src/models/inventory/inventory.db.model";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { ItemEntity } from "@src/server/domain/entities/ItemEntity";

export class ItemRepository extends BaseCollectionRepository<Item, ItemEntity> {
  protected readonly instanceName = "ItemRepository";
  constructor(database = new LocalDatabase()) {
    super(database.items); // Pass the specific collection
  }

  /** Private Getters */
  protected toDB(entity: ItemEntity): Item {
    return {
      id: entity.getId(),
      name: entity.getName(),
      description: entity.getDescription(),
      image: entity.getImage(),
      price: entity.getPrice(),
      rarity: entity.getRarity(),
      tags: entity.getTags(),
      hints: { source: entity.getSourceHints() },
      stackSize: entity.getStackSize(),
    };
  }
  protected toEntity(data: Item): Result<ItemEntity> {
    try {
      const entity = ItemEntity.fromData(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            itemId: data.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** Public Getters */
  public getById(itemId: string): Result<ItemEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "getById", {
        id: itemId,
        instanceName: this.instanceName,
      });

      const resultGetId = this.findOne({ id: itemId });
      if (ResultFactory.isError(resultGetId)) {
        const [, error] = resultGetId;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [item] = resultGetId;

      if (!item) {
        return [null, ErrorFactory.resourceNotFound(context, "item", itemId)];
      }

      return [item, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getById", {
            id: itemId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
