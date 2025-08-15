import { Document } from "@src/server/infrastructure/db/Document";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import { PlayerI } from "@src/models/player/PlayerModels";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export class PlayerRepository {
  private database: Document<PlayerI>;
  private readonly instanceName = "PlayerRepository";

  constructor(database = new LocalDatabase()) {
    this.database = database.player;
  }

  /** Private Getters */
  private toDB(entity: PlayerEntity): PlayerI {
    return {
      playerLevel: entity.getLevel(),
    };
  }

  private toEntity(data: PlayerI): Result<PlayerEntity> {
    try {
      const entity = PlayerEntity.fromData(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public get(): Result<PlayerEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "get", {
        instanceName: this.instanceName,
      });

      const dbResult = this.database.get();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [player] = dbResult;
      return this.toEntity(player);
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

  public save(entity: PlayerEntity): Result<PlayerEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "save", {
        instanceName: this.instanceName,
      });

      const dbItem = this.toDB(entity);

      // Try update first
      const updateResult = this.database.update(() => {
        return dbItem;
      });
      if (ResultFactory.isError(updateResult)) {
        const [, updateError] = updateResult;
        return [null, ErrorFactory.chainError(updateError, context)];
      }

      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "save", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** ONLY use for save/load */
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
