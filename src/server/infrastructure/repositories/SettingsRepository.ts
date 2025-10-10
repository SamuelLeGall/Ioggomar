import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { SettingsEntity } from "@src/server/domain/entities/SettingsEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { BaseDocumentRepository } from "@src/server/infrastructure/repositories/BaseDocumentRepository";
import { MainSettings } from "@src/models/game/settings.db.models";

export class SettingsRepository extends BaseDocumentRepository<
  MainSettings,
  SettingsEntity
> {
  protected readonly instanceName = "SettingsRepository";

  constructor(database = new LocalDatabase()) {
    super(database.gameSettings);
  }

  /** Private Getters */
  protected toDB(entity: SettingsEntity): MainSettings {
    return {
      currentLocalization: entity.getLocalization(),
      currentDataTheme: entity.getDataTheme(),
    };
  }
  protected toEntity(data: MainSettings): Result<SettingsEntity> {
    try {
      const entity = SettingsEntity.fromData(data);
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

  /** Getters **/
  public get(): Result<SettingsEntity> {
    return this.findOne();
  }

  public save(entity: SettingsEntity): Result<SettingsEntity> {
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
