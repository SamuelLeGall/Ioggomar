import { BaseCollectionRepository } from "@src/server/infrastructure/repositories/BaseCollectionRepository";
import { InventoryEntity } from "@src/server/domain/entities/InventoryEntity";
import { Inventory } from "@src/models/inventory/inventory.db.model";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import {
  AppErrorCodes,
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export class InventoryRepository extends BaseCollectionRepository<
  Inventory,
  InventoryEntity
> {
  protected readonly instanceName = "InventoryRepository";
  constructor(database = new LocalDatabase()) {
    super(database.inventories); // Pass the specific collection
  }

  /** Private Getters */
  protected toDB(entity: InventoryEntity): Inventory {
    return {
      id: entity.getId(),
      data: entity.getItems(),
    };
  }
  protected toEntity(data: Inventory): Result<InventoryEntity> {
    try {
      const entity = InventoryEntity.fromData(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            inventoryId: data.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** Public Getters */
  public getAll(): Result<InventoryEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "getAll", {
        instanceName: this.instanceName,
      });

      const dbResult = this.find({});
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [inventories] = dbResult;

      return [inventories, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getAll", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
  public getById(inventoryId: string): Result<InventoryEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "getById", {
        uuid: inventoryId,
        instanceName: this.instanceName,
      });

      const resultGetId = this.findOne({ id: inventoryId });
      if (ResultFactory.isError(resultGetId)) {
        const [, error] = resultGetId;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [inventory] = resultGetId;

      if (!inventory) {
        return [
          null,
          ErrorFactory.resourceNotFound(context, "inventory", inventoryId),
        ];
      }

      return [inventory, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getById", {
            uuid: inventoryId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public save(entity: InventoryEntity): Result<InventoryEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "save", {
        inventoryUUID: entity.getId(),
        instanceName: this.instanceName,
      });

      const dbItem = this.toDB(entity);

      // Try update first
      const updateResult = this.database.update(entity.getId(), dbItem);
      if (ResultFactory.isSuccess(updateResult)) {
        return [entity, null];
      }

      // If update failed because item doesn't exist, try add
      const [, updateError] = updateResult;
      if (updateError.code === AppErrorCodes.RESOURCE_NOT_FOUND) {
        const addResult = this.database.add(dbItem);
        if (ResultFactory.isError(addResult)) {
          const [, error] = addResult;
          return [null, ErrorFactory.chainError(error, context)];
        }
        return [entity, null];
      }

      // Other error, chain it
      return [null, ErrorFactory.chainError(updateError, context)];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "save", {
            inventoryUUID: entity.getId(),
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
