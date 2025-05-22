import { MainSettings } from "@src/models/game/SettingsModels";
import { OptionConfig } from "@src/models/BasicAndTempModels";

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
    this.gameSettings.currentLocalization = newLocalization;
  }

  public changeTheme(newTheme: OptionConfig) {
    this.gameSettings.currentDataTheme = newTheme;
  }
}
