import { GameSettingsEntity } from "@src/server/domain/entities/GameSettingsEntity";
import { MainSettingsForFrontend } from "@src/models/game/SettingsModels";

export function toGameSettingsForFrontend(
  entity: GameSettingsEntity
): MainSettingsForFrontend {
  return {
    currentLocalization: entity.getLocalization(),
    currentDataTheme: entity.getDataTheme(),
  };
}
