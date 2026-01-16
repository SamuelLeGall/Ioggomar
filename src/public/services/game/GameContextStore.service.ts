import { SettingsStoreService } from "@src/public/services/game/SettingsStore.service";
import { PlayerStoreService } from "@src/public/services/player/PlayerStore.service";
import { QuestStoreService } from "@src/public/services/quests/QuestStore.service";

export class GameContextStoreService {
  private settings: SettingsStoreService;
  private player: PlayerStoreService;
  private quests: QuestStoreService;

  constructor(
    settingsStoreService = new SettingsStoreService(),
    playerStoreService = new PlayerStoreService(),
    questsStoreService = new QuestStoreService(),
  ) {
    this.settings = settingsStoreService;
    this.player = playerStoreService;
    this.quests = questsStoreService;
  }
  /** This store should only be use for specific edge case that require full game sync **/
  public initialSyncAfterLoad = (): void => {
    this.settings.syncLocalization();
    this.settings.syncTheme();
    this.player.syncPlayer();
    this.quests.refreshAllQuests();
  };
}
