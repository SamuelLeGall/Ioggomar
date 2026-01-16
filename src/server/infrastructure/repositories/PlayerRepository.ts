import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { BaseDocumentRepository } from "@src/server/infrastructure/repositories/BaseDocumentRepository";
import { Player } from "@src/server/models/player/player.db.models";

export class PlayerRepository extends BaseDocumentRepository<
  Player,
  PlayerEntity
> {
  protected readonly instanceName = "PlayerRepository";

  constructor(database = new LocalDatabase()) {
    super(database.player);
  }

  /** Private Getters */
  protected toDB(entity: PlayerEntity): Player {
    return {
      playerLevel: entity.getLevel(),
    };
  }
  protected toEntity(data: Player): Result<PlayerEntity> {
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
    return this.findOne();
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
}
