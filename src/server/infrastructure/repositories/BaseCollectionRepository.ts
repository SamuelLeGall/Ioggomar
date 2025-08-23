import { Collection } from "@src/server/infrastructure/db/Collection";
import {
  ErrorFactory,
  QueryParam,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export abstract class BaseCollectionRepository<
  TDbItem extends { id: string },
  TEntity,
> {
  protected readonly database: Collection<TDbItem>;
  protected abstract readonly instanceName: string;

  protected constructor(database: Collection<TDbItem>) {
    this.database = database;
  }

  // Abstract methods that each repo must implement
  protected abstract toEntity(dbItem: TDbItem): Result<TEntity>;
  protected abstract toDB(dbItem: TEntity): TDbItem;

  // Shared implementation - same for all repos
  protected find(query: QueryParam<unknown>): Result<TEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "find", {
        query,
        instanceName: this.instanceName,
      });

      const dbResult = this.database.find(query);
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [items] = dbResult;

      const entities: TEntity[] = [];
      for (const item of items) {
        const entityResult = this.toEntity(item);
        if (ResultFactory.isError(entityResult)) {
          const [, error] = entityResult;
          return [null, ErrorFactory.chainError(error, context)];
        }
        const [entity] = entityResult;
        entities.push(entity);
      }

      return [entities, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "find", {
            query,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
  protected findOne(query: QueryParam<unknown>): Result<TEntity | null> {
    try {
      const context = ErrorFactory.createContext("Repository", "findOne", {
        query,
        instanceName: this.instanceName,
      });

      const dbResult = this.database.findOne(query);
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [item] = dbResult;
      if (!item) {
        return [null, null];
      }

      return this.toEntity(item);
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "findOne", {
            query,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** DON'T use this method except when loading/saving the game   */
  public restoreDefault(): Result<true> {
    try {
      const resetResult = this.database._forceReset();
      if (ResultFactory.isError(resetResult)) {
        const [, error] = resetResult;
        return [
          null,
          ErrorFactory.chainError(
            error,
            ErrorFactory.createContext("Repository", "restoreDefault", {
              instanceName: this.instanceName,
            }),
          ),
        ];
      }
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "restoreDefault", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
