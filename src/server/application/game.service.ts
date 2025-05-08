import {
  AppError,
  AppErrorCodes,
  OptionConfig,
} from "@src/models/BasicAndTempModels";
import { MainSettings } from "@src/models/game/SettingsModels";
import { GameRepository } from "@src/server/infrastructure/repositories/GameRepository";

export class GameService {
  private repository: GameRepository;

  constructor(repository = new GameRepository()) {
    this.repository = repository;
  }
  /** High-level Actions **/
  changeLocalization(newLocalization: OptionConfig) {
    try {
      // Perform any additional logic before setting the new localization
      this.repository.setCurrentLocalization(newLocalization);
    } catch (e) {
      console.error("changeLocalization - unexpected error:", e);
    }
  }

  changeTheme(newTheme: OptionConfig) {
    try {
      // Perform any additional logic before setting the new theme
      this.repository.setCurrentDataTheme(newTheme);
    } catch (e) {
      console.error("changeTheme - unexpected error:", e);
    }
  }

  getCurrentLocalization(): OptionConfig {
    try {
      return this.repository.getLocalization();
    }catch (e) {
      console.error("getCurrentLocalization - unexpected error:", e);
      return this.repository.getLocalization();
    }
  }

  getCurrentTheme(): OptionConfig {
    try {
      return this.repository.getDataTheme();
    }catch (e) {
      console.error("getCurrentTheme - unexpected error:", e);
      return this.repository.getDataTheme();
    }
  }

  // initializeGameState(savedState: MainSettings) {
  //   try {
  //     if (savedState) {
  //       this.repository.setGameStoreState(savedState);
  //     } else {
  //       // Optionally set default state if no saved state exists
  //       this.repository.setCurrentLocalization({
  //         key: "en_US",
  //         value: "English",
  //       });
  //       this.repository.setCurrentDataTheme({ key: "light", value: "Light" });
  //     }
  //   }catch (e) {
  //     console.error("initializeGameState - unexpected error:", e);
  //   }
  // }

  // exportGameState(): MainSettings {
  //   return this.repository.getGameStoreState();
  // }

  // resetGameSettings() {
  //   // Reset to default values
  //   this.repository.setCurrentLocalization({ key: "en_US", value: "English" });
  //   this.repository.setCurrentDataTheme({ key: "light", value: "Light" });
  // }
}
