import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import { PlayerForFrontend } from "@src/models/player/PlayerModels";
import { ErrorFactory, Result } from "@src/models/BasicAndTempModels";

export function toPlayerForFrontend(
  entity: PlayerEntity,
): Result<PlayerForFrontend> {
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
