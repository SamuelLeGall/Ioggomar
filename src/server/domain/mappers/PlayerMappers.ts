import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import { PlayerForFrontend } from "@src/models/player/PlayerModels";

export function toPlayerForFrontend(entity: PlayerEntity): PlayerForFrontend {
  return {
    level: entity.getLevel(),
  };
}
