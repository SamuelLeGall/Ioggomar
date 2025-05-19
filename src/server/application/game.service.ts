import {
  AppError,
  AppErrorCodes,
  OptionConfig,
  Result,
} from "@src/models/BasicAndTempModels";
import { GameRepository } from "@src/server/infrastructure/repositories/GameRepository";
import { gameCollection } from "@src/server/infrastructure/db/collections/defaultValues/game.default";
import { toDataThemeForFrontend, toLocalizationForFrontend } from "@src/server/domain/mappers/GameSettingsMappers";

export class GameService {
  private repository: GameRepository;

  constructor(repository = new GameRepository()) {
    this.repository = repository;
  }
  /** High-level Actions **/
  // TODO voir si on reste sur des methodes séparés ou si on retourne un Result<MainSettingsForFrontend> ?
  getCurrentLocalization(): Result<OptionConfig> {
    try {
      const settings = this.repository.get();
      return [toLocalizationForFrontend(settings), null];
    } catch (e) {
      return [
        null,
        new AppError(
          "getCurrentLocalization - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ];
    }
  }

  getCurrentTheme(): Result<OptionConfig> {
    try {
      const settings = this.repository.get();
      return [toDataThemeForFrontend(settings), null];
    } catch (e) {
      return [
        null,
        new AppError(
          "getCurrentLocalization - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ];
    }
  }

  changeLocalization(newLocalization: OptionConfig): Result<true> {
    try {
      const settings = this.repository.get();
      settings.changeLocalization(newLocalization);
      this.repository.update(settings);
      return [true, null];
    } catch (e) {
      return [
        null,
        new AppError(
          "changeLocalization - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ];
    }
  }

  changeTheme(newTheme: OptionConfig): Result<boolean> {
    try {
      const settings = this.repository.get();
      settings.changeTheme(newTheme);
      this.repository.update(settings);
      return [true, null];
    } catch (e) {
      return [
        null,
        new AppError(
          "changeTheme - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ];
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

  resetGameSettings(): Result<true> {
    const settings = this.repository.get();
    settings.changeLocalization(gameCollection.currentLocalization);
    settings.changeTheme(gameCollection.currentDataTheme);
    this.repository.update(settings);
    return [true, null];
  }
}
