import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import { ErrorFactory, Result } from "@src/server/models/BasicAndTempModels";
import { PlayerUI } from "@src/server/models/player/player.frontend.model";

export function toPlayerForFrontend(entity: PlayerEntity): Result<PlayerUI> {
  try {
    return [
      {
        level: entity.getLevel(),
      },
      null,
    ];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toPlayerForFrontend", {}),
        e,
      ),
    ];
  }
}
