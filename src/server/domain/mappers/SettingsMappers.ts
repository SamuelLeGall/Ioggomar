import { SettingsEntity } from "@src/server/domain/entities/SettingsEntity";
import { MainSettingsForFrontend } from "@src/models/game/SettingsModels";
import {
  ErrorFactory,
  OptionConfig,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export function toLocalizationForFrontend(
  entity: SettingsEntity,
): Result<OptionConfig> {
  try {
    return [entity.getLocalization(), null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toLocalizationForFrontend", {}),
        e,
      ),
    ];
  }
}

export function toDataThemeForFrontend(
  entity: SettingsEntity,
): Result<OptionConfig> {
  try {
    return [entity.getDataTheme(), null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toDataThemeForFrontend", {}),
        e,
      ),
    ];
  }
}

export function toGameSettingsForFrontend(
  entity: SettingsEntity,
): Result<MainSettingsForFrontend> {
  try {
    const resGetLocalization = toLocalizationForFrontend(entity);
    if (ResultFactory.isError(resGetLocalization)) {
      const [, errorGetLocalization] = resGetLocalization;
      return [
        null,
        ErrorFactory.chainError(
          errorGetLocalization,
          ErrorFactory.createContext("Mapper", "toGameSettingsForFrontend", {}),
        ),
      ];
    }

    const resGetDataTheme = toDataThemeForFrontend(entity);
    if (ResultFactory.isError(resGetDataTheme)) {
      const [, errorDataTheme] = resGetDataTheme;
      return [
        null,
        ErrorFactory.chainError(
          errorDataTheme,
          ErrorFactory.createContext("Mapper", "toGameSettingsForFrontend", {}),
        ),
      ];
    }

    const [localization] = resGetLocalization;
    const [dataTheme] = resGetDataTheme;

    return [
      {
        currentLocalization: localization,
        currentDataTheme: dataTheme,
      },
      null,
    ];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toGameSettingsForFrontend", {}),
        e,
      ),
    ];
  }
}
