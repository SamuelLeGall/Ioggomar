import { PlayerRepository } from "@src/server/infrastructure/repositories/PlayerRepository";
import {
  ErrorFactory,
  FrontendResult,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { toPlayerForFrontend } from "@src/server/domain/mappers/PlayerMappers";
import { PlayerUI } from "@src/models/player/player.frontend.model";

export class PlayerService {
  private readonly instanceName = "PlayerService";
  private repository: PlayerRepository;

  constructor(repository = new PlayerRepository()) {
    this.repository = repository;
  }

  getPlayer(): FrontendResult<PlayerUI> {
    try {
      const resultGetPlayer = this.repository.get();
      if (ResultFactory.isError(resultGetPlayer)) {
        const [, errorGetPlayer] = resultGetPlayer;
        errorGetPlayer.logToConsole();
        return [null, errorGetPlayer.getPublicMessage()];
      }
      const [player] = resultGetPlayer;

      const resultFrontend = toPlayerForFrontend(player);
      if (ResultFactory.isError(resultFrontend)) {
        const [, errorMapperSetting] = resultFrontend;
        errorMapperSetting.logToConsole();
        return [null, errorMapperSetting.getPublicMessage()];
      }
      const [frontendPlayer] = resultFrontend;

      return [frontendPlayer, null];
    } catch (e) {
      console.error(`getPlayer - unexpected error: ${JSON.stringify(e)}`);
      return [null, "Internal Server Error"];
    }
  }

  levelUp(nbLevelsToAdd: number): FrontendResult<true> {
    try {
      const resultGetPlayer = this.repository.get();
      if (ResultFactory.isError(resultGetPlayer)) {
        const [, errorGetPlayer] = resultGetPlayer;
        errorGetPlayer.logToConsole();
        return [null, errorGetPlayer.getPublicMessage()];
      }
      const [player] = resultGetPlayer;

      const resultLevelUp = player.levelUp(nbLevelsToAdd);
      if (ResultFactory.isError(resultLevelUp)) {
        const [, errorLevelUp] = resultLevelUp;
        errorLevelUp.logToConsole();
        return [null, errorLevelUp.getPublicMessage()];
      }

      const resultUpdateSaved = this.repository.save(player);
      if (ResultFactory.isError(resultUpdateSaved)) {
        const [, errorUpdateSaved] = resultUpdateSaved;
        errorUpdateSaved.logToConsole();
        return [null, errorUpdateSaved.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error(`levelUp - unexpected error: ${JSON.stringify(e)}`);
      return [null, "Internal Server Error"];
    }
  }

  engageDiscussion(): FrontendResult<boolean> {
    // TODO
    return [true, null];
  }

  initializePlayer(): Result<true> {
    try {
      const resultRestoreDefault = this.repository.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefault)) {
        const [, errorRestore] = resultRestoreDefault;
        return [
          null,
          ErrorFactory.chainError(
            errorRestore,
            ErrorFactory.createContext("Service", "initializePlayer", {
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
          ErrorFactory.createContext("Service", "initializePlayer", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
