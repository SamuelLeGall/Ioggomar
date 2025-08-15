import { MainSettings } from "@src/models/game/SettingsModels";
import { ErrorFactory, OptionConfig } from "@src/models/BasicAndTempModels";

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
  public changeLocalization(newLocalization: OptionConfig) {
    try {
      this.gameSettings.currentLocalization = newLocalization;
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

  public changeTheme(newTheme: OptionConfig) {
    try {
      this.gameSettings.currentDataTheme = newTheme;
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
