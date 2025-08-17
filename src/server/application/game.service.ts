import { PlayerService } from "@src/server/application/player.service";
import { QuestService } from "@src/server/application/quests/quest.service";
import { SettingsService } from "@src/server/application/settings.service";
import {
  GameDatabase,
  LocalDatabase,
} from "@src/server/infrastructure/db/LocalDatabase";
import {
  ErrorFactory,
  FrontendResult,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export class GameService {
  private readonly instanceName = "GameService";
  private settingsService: SettingsService;
  private playerService: PlayerService;
  private questService: QuestService;
  /** try not to use the database directly when you can use the services */
  private database: LocalDatabase;

  constructor(
    database = new LocalDatabase(),
    settingsService = new SettingsService(),
    playerService = new PlayerService(),
    questService = new QuestService(),
  ) {
    this.database = database;
    this.settingsService = settingsService;
    this.playerService = playerService;
    this.questService = questService;
  }

  private initializeGlobal(): Result<boolean> {
    try {
      const context = ErrorFactory.createContext(
        "Service",
        "initializeGlobal",
        {
          instanceName: this.instanceName,
        },
      );

      const resultInitilizeSettings = this.settingsService.initializeSettings();
      if (ResultFactory.isError(resultInitilizeSettings)) {
        const [, errorInitializeSettings] = resultInitilizeSettings;
        return [
          null,
          ErrorFactory.chainError(errorInitializeSettings, context),
        ];
      }

      const resultInitilizePlayer = this.playerService.initializePlayer();
      if (ResultFactory.isError(resultInitilizePlayer)) {
        const [, errorInitializePlayer] = resultInitilizePlayer;
        return [null, ErrorFactory.chainError(errorInitializePlayer, context)];
      }

      const resultInitilizeQuests = this.questService.initializeQuests();
      if (ResultFactory.isError(resultInitilizeQuests)) {
        const [, errorInitializeQuests] = resultInitilizeQuests;
        return [null, ErrorFactory.chainError(errorInitializeQuests, context)];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "initializeGlobal", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public initialize(): FrontendResult<boolean> {
    try {
      const resultInitializeGlobal = this.initializeGlobal();
      if (ResultFactory.isError(resultInitializeGlobal)) {
        const [, errorInitializeGlobal] = resultInitializeGlobal;
        console.error(errorInitializeGlobal);
        return [null, errorInitializeGlobal.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error("initialize - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public resume(): FrontendResult<boolean> {
    // nothing to do...
    return [true, null];
  }

  public reset(): FrontendResult<boolean> {
    return this.initialize();
  }

  public async save(): Promise<FrontendResult<boolean>> {
    try {
      const resultDumpExistingDB = this.database._DumpDB();
      if (ResultFactory.isError(resultDumpExistingDB)) {
        const [, errorDumpExistingDB] = resultDumpExistingDB;
        console.error(errorDumpExistingDB);
        return [null, errorDumpExistingDB.getPublicMessage()];
      }
      const [dumpDB] = resultDumpExistingDB;

      const isSaved = await window.electronAPI.saveGame(dumpDB);
      if (!isSaved) {
        console.error("save - electronAPI.saveGame - failure .....");
        return [null, "Internal Server Error"];
      }

      alert("Game saved successfully.");
      return [true, null];
    } catch (e) {
      console.error("save - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public async load(): Promise<FrontendResult<boolean>> {
    try {
      const gameData = (await window.electronAPI.loadGame()) as GameDatabase;
      if (!gameData) {
        console.error("load - electronAPI.loadGame - no data ....");
        return [false, null];
      }

      const resultRestoreDBFromFile = this.database._RestoreDB(gameData);
      if (ResultFactory.isError(resultRestoreDBFromFile)) {
        const [, errorRestoreDBFromFile] = resultRestoreDBFromFile;
        return [null, errorRestoreDBFromFile.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error("load - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }
}
