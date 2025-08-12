import { PlayerService } from "@src/server/application/player.service";
import { QuestService } from "@src/server/application/quests/quest.service";
import { SettingsService } from "@src/server/application/settings.service";
import { GameDatabase, LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";

export class GameService {
  private settingsService: SettingsService;
  private playerService: PlayerService;
  private questService: QuestService;
  /** try not to use the database directly when you can use the services */
  private database: LocalDatabase;

  constructor(
    database = new LocalDatabase(),
    settingsService = new SettingsService(),
    playerService = new PlayerService(),
    questService = new QuestService()
  ) {
    this.database = database;
    this.settingsService = settingsService;
    this.playerService = playerService;
    this.questService = questService;
  }

  public resume() {
    // nothing to do...
  }

  public initialize() {
    this.settingsService.initializeSettings();
    this.playerService.initializePlayer();
    this.questService.initializeQuests();
  }

  public reset() {
    this.initialize();
  }

  public async save() {
    const saveData = this.database._DumpDB();
    const isSaved = await window.electronAPI.saveGame(saveData);
    if (isSaved) {
      alert("Game saved successfully.");
    }
  }

  public async load(): Promise<boolean> {
    const gameData: GameDatabase = await window.electronAPI.loadGame();
    if (!gameData) {
      return false;
    }
    this.database._RestoreDB(gameData);
    return true;
  }
}
