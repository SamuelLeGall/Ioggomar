import { OptionConfig } from "@src/models/BasicAndTempModels";
import { MainSettings } from "@src/models/game/SettingsModels";
import { GameRepository } from "../repositories/GameRepository";

export class GameService {
  private repository: GameRepository;

  constructor(repository = new GameRepository()) {
    this.repository = repository;
  }
  /** High-level Actions **/
  changeLocalization(newLocalization: OptionConfig) {
    // Perform any additional logic before setting the new localization
    this.repository.setCurrentLocalization(newLocalization);
  }

  changeTheme(newTheme: OptionConfig) {
    // Perform any additional logic before setting the new theme
    this.repository.setCurrentDataTheme(newTheme);
  }


  getCurrentLocalizationLibelles() {
    return this.repository.getLocalizationLibelle();
  }

  getCurrentLocalization(): OptionConfig {
    return this.repository.getLocalization();
  }

  getCurrentTheme(): OptionConfig {
    return this.repository.getDataTheme();
  }

  initializeGameState(savedState: MainSettings) {
    if (savedState) {
      this.repository.setGameStoreState(savedState);
    } else {
      // Optionally set default state if no saved state exists
      this.repository.setCurrentLocalization({
        key: "en_US",
        value: "English",
      });
      this.repository.setCurrentDataTheme({ key: "light", value: "Light" });
    }
  }

  exportGameState(): MainSettings {
    return this.repository.getGameStoreState();
  }

  resetGameSettings() {
    // Reset to default values
    this.repository.setCurrentLocalization({ key: "en_US", value: "English" });
    this.repository.setCurrentDataTheme({ key: "light", value: "Light" });
  }
}
