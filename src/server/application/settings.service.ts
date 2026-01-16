import {
  ErrorFactory,
  FrontendResult,
  OptionConfig,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { SettingsRepository } from "@src/server/infrastructure/repositories/SettingsRepository";
import {
  toDataThemeForFrontend,
  toLocalizationForFrontend,
} from "@src/server/domain/mappers/SettingsMappers";

export class SettingsService {
  private repository: SettingsRepository;
  private readonly instanceName = "SettingsService";

  constructor(repository = new SettingsRepository()) {
    this.repository = repository;
  }
  /** High-level Actions **/
  getCurrentLocalization(): FrontendResult<OptionConfig> {
    try {
      const resultSettings = this.repository.get();
      if (ResultFactory.isError(resultSettings)) {
        const [, errorSettings] = resultSettings;
        errorSettings.logToConsole();
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultSettings;

      const resultFrontend = toLocalizationForFrontend(settings);
      if (ResultFactory.isError(resultFrontend)) {
        const [, errorMapperSetting] = resultFrontend;
        errorMapperSetting.logToConsole();
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
        errorSettings.logToConsole();
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultSettings;

      const resultFrontend = toDataThemeForFrontend(settings);
      if (ResultFactory.isError(resultFrontend)) {
        const [, errorMapperSetting] = resultFrontend;
        errorMapperSetting.logToConsole();
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
        errorSettings.logToConsole();
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultGetSettings;

      const resultChangeLocalization =
        settings.changeLocalization(newLocalization);
      if (ResultFactory.isError(resultChangeLocalization)) {
        const [, errorChange] = resultChangeLocalization;
        errorChange.logToConsole();
        return [null, errorChange.getPublicMessage()];
      }

      const resultUpdateSaved = this.repository.save(settings);
      if (ResultFactory.isError(resultUpdateSaved)) {
        const [, errorUpdateSaved] = resultUpdateSaved;
        errorUpdateSaved.logToConsole();
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
        errorSettings.logToConsole();
        return [null, errorSettings.getPublicMessage()];
      }
      const [settings] = resultGetSettings;

      const resultChangeTheme = settings.changeTheme(newTheme);
      if (ResultFactory.isError(resultChangeTheme)) {
        const [, errorChange] = resultChangeTheme;
        errorChange.logToConsole();
        return [null, errorChange.getPublicMessage()];
      }

      const resultUpdateSaved = this.repository.save(settings);
      if (ResultFactory.isError(resultUpdateSaved)) {
        const [, errorUpdateSaved] = resultUpdateSaved;
        errorUpdateSaved.logToConsole();
        return [null, errorUpdateSaved.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error(`changeTheme - unexpected error: ${JSON.stringify(e)}`);
      return [null, "Internal Server Error"];
    }
  }

  initializeSettings(): Result<true> {
    try {
      const resultRestoreDefault = this.repository.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefault)) {
        const [, errorRestore] = resultRestoreDefault;
        return [
          null,
          ErrorFactory.chainError(
            errorRestore,
            ErrorFactory.createContext("Service", "initializeSettings", {
              instanceName: this.instanceName,
            }),
          ),
        ];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "initializeSettings", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
