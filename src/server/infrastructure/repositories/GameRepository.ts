import { OptionConfig } from "@src/models/BasicAndTempModels";
import { MainSettings } from "@src/models/game/SettingsModels";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { gameCollectionModel } from "@src/server/infrastructure/db/collections/defaultValues/game.default";
import {Document} from "@src/server/infrastructure/db/Document";

export class GameRepository {
  private database: Document<gameCollectionModel>;

  constructor(database = new LocalDatabase()) {
    this.database = database.gameSettings;
  }

  /** Getters **/
  getLocalizationText(): string {
    return this.database.get().currentLocalization.value;
  }

  getLocalizationKey(): string {
    return this.database.get().currentLocalization.key;
  }

  getLocalization(): OptionConfig {
    return {
      key: this.getLocalizationKey(),
      value: this.getLocalizationText(),
    };
  }

  getDataThemeText(): string {
    return this.database.get().currentDataTheme.value;
  }

  getDataThemeKey(): string {
    return this.database.get().currentDataTheme.key;
  }

  getDataTheme(): OptionConfig {
    return {
      key: this.getDataThemeKey(),
      value: this.getDataThemeText(),
    };
  }

  /** Technical Actions - no actual high level user-action at this level **/
  setCurrentLocalization(newLocalization: OptionConfig): void {
    this.database.update((doc:gameCollectionModel) => {
      return {
        ...doc,
        currentLocalization: newLocalization
      }
    });
  }

  setCurrentDataTheme(newDataTheme: OptionConfig): void {
    // we update the DB
    this.database.update((doc:gameCollectionModel) => {
      return {
        ...doc,
        currentDataTheme: newDataTheme
      }
    });
  }

  getGameStoreState(): MainSettings {
    return {
      currentLocalization: this.getLocalization(),
      currentDataTheme: this.getDataTheme(),
    };
  }

  setGameStoreState(data: MainSettings): void {
    this.setCurrentLocalization(data.currentLocalization);
    this.setCurrentDataTheme(data.currentDataTheme);
  }
}
