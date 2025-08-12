import { MainSettings } from "@src/models/game/SettingsModels";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Document } from "@src/server/infrastructure/db/Document";
import { SettingsEntity } from "@src/server/domain/entities/SettingsEntity";

export class SettingsRepository {
  private database: Document<MainSettings>;

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

  private toEntity(data: MainSettings): SettingsEntity {
    return SettingsEntity.fromData(data);
  }

  /** Getters **/
  public get(): SettingsEntity {
    return this.toEntity(this.database.get());
  }

  public update(entity: SettingsEntity): void {
    this.database.update(() => {
      return this.toDB(entity);
    });
  }

  /** ONLY use for save/load */
  public restoreDefault() {
    this.database._forceReset();
  }
}
