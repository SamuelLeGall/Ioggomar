import {
  AppError,
  AppErrorCodes,
  OptionConfig,
  Result,
} from "@src/models/BasicAndTempModels";
import { SettingsRepository } from "@src/server/infrastructure/repositories/SettingsRepository";
import {
  toDataThemeForFrontend,
  toLocalizationForFrontend,
} from "@src/server/domain/mappers/SettingsMappers";

export class SettingsService {
  private repository: SettingsRepository;

  constructor(repository = new SettingsRepository()) {
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
          AppErrorCodes.ERROR_NOT_FOUND,
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
          AppErrorCodes.ERROR_NOT_FOUND,
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
          AppErrorCodes.ERROR_NOT_FOUND,
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
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  initializeSettings(): Result<true> {
    this.repository.restoreDefault();
    return [true, null];
  }
}
