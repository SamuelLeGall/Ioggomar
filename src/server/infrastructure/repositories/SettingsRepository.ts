import { MainSettings } from "@src/models/game/SettingsModels";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Document } from "@src/server/infrastructure/db/Document";
import { SettingsEntity } from "@src/server/domain/entities/SettingsEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export class SettingsRepository {
  private database: Document<MainSettings>;
  private readonly instanceName = "SettingsRepository";

  constructor(database = new LocalDatabase()) {
    this.database = database.gameSettings;
  }

  /** Private Getters */
  private toDB(entity: SettingsEntity): MainSettings {
    return {
      currentLocalization: entity.getLocalization(),
      currentDataTheme: entity.getDataTheme(),
    };
  }

  private toEntity(data: MainSettings): Result<SettingsEntity> {
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
    try {
      const context = ErrorFactory.createContext("Repository", "get", {
        instanceName: this.instanceName,
      });

      const dbResult = this.database.get();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [settings] = dbResult;
      return this.toEntity(settings);
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
