import {
  ErrorFactory,
  OptionConfig,
  Result,
} from "@src/server/models/BasicAndTempModels";
import { MainSettings } from "@src/server/models/game/settings.db.models";

export class SettingsEntity {
  private readonly gameSettings: MainSettings;

  private constructor(gameSettings: MainSettings) {
    this.gameSettings = gameSettings;
  }

  // For recreating from raw/persisted data
  public static fromData(data: MainSettings): SettingsEntity {
    return new SettingsEntity(data);
  }

  /** Getters **/
  public getLocalization(): OptionConfig {
    return this.gameSettings.currentLocalization;
  }

  public getDataTheme(): OptionConfig {
    return this.gameSettings.currentDataTheme;
  }

  /** Setters **/
  public changeLocalization(newLocalization: OptionConfig): Result<boolean> {
    try {
      this.gameSettings.currentLocalization = newLocalization;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "changeLocalization", {
            newLocalization,
          }),
          e,
        ),
      ];
    }
  }

  public changeTheme(newTheme: OptionConfig): Result<boolean> {
    try {
      this.gameSettings.currentDataTheme = newTheme;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "changeTheme", {
            newTheme,
          }),
          e,
        ),
      ];
    }
  }
}
