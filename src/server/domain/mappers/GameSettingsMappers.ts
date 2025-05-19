import { GameSettingsEntity } from "@src/server/domain/entities/GameSettingsEntity";
import { MainSettingsForFrontend } from "@src/models/game/SettingsModels";
import { OptionConfig } from "@src/models/BasicAndTempModels";

export function toGameSettingsForFrontend(
  entity: GameSettingsEntity
): MainSettingsForFrontend {
  return {
    currentLocalization: toLocalizationForFrontend(entity),
    currentDataTheme: toDataThemeForFrontend(entity),
  };
}

export function toLocalizationForFrontend(
  entity: GameSettingsEntity
): OptionConfig {
  return  entity.getLocalization();
}
export function toDataThemeForFrontend(
  entity: GameSettingsEntity
): OptionConfig {
  return  entity.getDataTheme();
}
