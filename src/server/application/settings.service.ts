import {
  FrontendResult,
  OptionConfig,
  ResultFactory,
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
  getCurrentLocalization(): FrontendResult<OptionConfig> {
    try {
      const resultSettings = this.repository.get();
      if (ResultFactory.isError(resultSettings)) {
        const [, errorSettings] = resultSettings;
        console.error(errorSettings);
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultSettings;

      const resultFrontend = toLocalizationForFrontend(settings);
      if (ResultFactory.isError(resultFrontend)) {
        const [, errorMapperSetting] = resultFrontend;
        console.error(errorMapperSetting);
        return [null, errorMapperSetting.getPublicMessage()];
      }
      const [frontendSetting] = resultFrontend;

      return [frontendSetting, null];
    } catch (e) {
      console.error(
        `getCurrentLocalization - unexpected error: ${JSON.stringify(e)}`,
      );
      return [null, "Internal Server Error"];
    }
  }

  getCurrentTheme(): FrontendResult<OptionConfig> {
    try {
      const resultSettings = this.repository.get();
      if (ResultFactory.isError(resultSettings)) {
        const [, errorSettings] = resultSettings;
        console.error(errorSettings);
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultSettings;

      const resultFrontend = toDataThemeForFrontend(settings);
      if (ResultFactory.isError(resultFrontend)) {
        const [, errorMapperSetting] = resultFrontend;
        console.error(errorMapperSetting);
        return [null, errorMapperSetting.getPublicMessage()];
      }
      const [frontendSetting] = resultFrontend;

      return [frontendSetting, null];
    } catch (e) {
      console.error(`getCurrentTheme - unexpected error: ${JSON.stringify(e)}`);
      return [null, "Internal Server Error"];
    }
  }

  changeLocalization(newLocalization: OptionConfig): FrontendResult<true> {
    try {
      const resultGetSettings = this.repository.get();
      if (ResultFactory.isError(resultGetSettings)) {
        const [, errorSettings] = resultGetSettings;
        console.error(errorSettings);
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultGetSettings;

      const resultChangeLocalization =
        settings.changeLocalization(newLocalization);
      if (ResultFactory.isError(resultChangeLocalization)) {
        const [, errorChange] = resultChangeLocalization;
        console.error(errorChange);
        return [null, errorChange.getPublicMessage()];
      }

      const resultUpdateSaved = this.repository.save(settings);
      if (ResultFactory.isError(resultUpdateSaved)) {
        const [, errorUpdateSaved] = resultUpdateSaved;
        console.error(errorUpdateSaved);
        return [null, errorUpdateSaved.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error(
        `changeLocalization - unexpected error: ${JSON.stringify(e)}`,
      );
      return [null, "Internal Server Error"];
    }
  }

  changeTheme(newTheme: OptionConfig): FrontendResult<boolean> {
    try {
      const resultGetSettings = this.repository.get();
      if (ResultFactory.isError(resultGetSettings)) {
        const [, errorSettings] = resultGetSettings;
        console.error(errorSettings);
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultGetSettings;

      const resultChangeTheme = settings.changeTheme(newTheme);
      if (ResultFactory.isError(resultChangeTheme)) {
        const [, errorChange] = resultChangeTheme;
        console.error(errorChange);
        return [null, errorChange.getPublicMessage()];
      }

      const resultUpdateSaved = this.repository.save(settings);
      if (ResultFactory.isError(resultUpdateSaved)) {
        const [, errorUpdateSaved] = resultUpdateSaved;
        console.error(errorUpdateSaved);
        return [null, errorUpdateSaved.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error(`changeTheme - unexpected error: ${JSON.stringify(e)}`);
      return [null, "Internal Server Error"];
    }
  }

  initializeSettings(): FrontendResult<true> {
    try {
      const resultRestoreDefault = this.repository.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefault)) {
        const [, errorRestore] = resultRestoreDefault;
        console.error(errorRestore);
        return [null, errorRestore.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error(
        `initializeSettings - unexpected error: ${JSON.stringify(e)}`,
      );
      return [null, "Internal Server Error"];
    }
  }
}
