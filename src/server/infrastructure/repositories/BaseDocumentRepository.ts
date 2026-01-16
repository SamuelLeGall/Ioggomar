import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { Document } from "@src/server/infrastructure/db/Document";

export abstract class BaseDocumentRepository<TDbItem, TEntity> {
  protected readonly database: Document<TDbItem>;
  protected abstract readonly instanceName: string;

  protected constructor(database: Document<TDbItem>) {
    this.database = database;
  }

  // Abstract methods that each repo must implement
  protected abstract toEntity(dbItem: TDbItem): Result<TEntity>;
  protected abstract toDB(dbItem: TEntity): TDbItem;

  // Shared implementation - same for all repos
  protected findOne(): Result<TEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "get", {
        instanceName: this.instanceName,
      });

      const dbResult = this.database.get();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [item] = dbResult;
      return this.toEntity(item);
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "get", {
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
