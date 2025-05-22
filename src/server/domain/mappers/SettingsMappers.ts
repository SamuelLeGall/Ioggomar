import { SettingsEntity } from "@src/server/domain/entities/SettingsEntity";
import { MainSettingsForFrontend } from "@src/models/game/SettingsModels";
import { OptionConfig } from "@src/models/BasicAndTempModels";

export function toGameSettingsForFrontend(
  entity: SettingsEntity
): MainSettingsForFrontend {
  return {
    currentLocalization: toLocalizationForFrontend(entity),
    currentDataTheme: toDataThemeForFrontend(entity),
  };
}

export function toLocalizationForFrontend(
  entity: SettingsEntity
): OptionConfig {
  return  entity.getLocalization();
}
export function toDataThemeForFrontend(
  entity: SettingsEntity
): OptionConfig {
  return  entity.getDataTheme();
}
