import { gameCollection } from "@src/server/infrastructure/db/game";
import { OptionConfig } from "@src/models/BasicAndTempModels";
import { MainSettings } from "@src/models/game/SettingsModels";

export class GameRepository {
  private database;

  constructor(database = gameCollection) {
    this.database = database;
  }

  /** Getters **/
  getLocalizationText(): string {
    return this.database.currentLocalization.value;
  }

  getLocalizationKey(): string {
    return this.database.currentLocalization.key;
  }

  getLocalization(): OptionConfig {
    return {
      key: this.getLocalizationKey(),
      value: this.getLocalizationText(),
    };
  }

  getDataThemeText(): string {
    return this.database.currentDataTheme.value;
  }

  getDataThemeKey(): string {
    return this.database.currentDataTheme.key;
  }

  getDataTheme(): OptionConfig {
    return {
      key: this.getDataThemeKey(),
      value: this.getDataThemeText(),
    };
  }

  /** Technical Actions - no actual high level user-action at this level **/
  setCurrentLocalization(newLocalization: OptionConfig): void {
    this.database.currentLocalization = newLocalization;
  }

  setCurrentDataTheme(newDataTheme: OptionConfig): void {
    this.database.currentDataTheme = newDataTheme;
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
