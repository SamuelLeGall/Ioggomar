import { PlayerRepository } from "@src/server/infrastructure/repositories/PlayerRepository";
import { PlayerForFrontend } from "@src/models/player/PlayerModels";
import { AppError, AppErrorCodes, Result } from "@src/models/BasicAndTempModels";
import { toPlayerForFrontend } from "@src/server/domain/mappers/PlayerMappers";

export class PlayerService {
  private repository: PlayerRepository;

  constructor(repository = new PlayerRepository()) {
    this.repository = repository;
  }

  getPlayer(): Result<PlayerForFrontend>{
    try {
      const player = this.repository.get();
      return [
        toPlayerForFrontend(player),
        null,
      ];
    }catch (e) {
      console.error("getPlayer - unexpected error:", e);
      return [
        null,
        new AppError(
          "getPlayer - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ];
    }
  }

  levelUp(nbLevelsToAdd: number):Result<true> {
    try {
      const player = this.repository.get();
      player.levelUp(nbLevelsToAdd);
      this.repository.update(player);
      return [true,null]
    }catch (e) {
      return [
        null,
        new AppError(
          "Player - levelUp - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND
        ),
      ]
    }
  }

  engageDiscussion() {
    // TODO
    return true;
  }

  initializePlayer(): Result<true> {
    this.repository.restoreDefault()
    return [true, null];
  }
}
