import { usePlayerStore } from "@src/store/player";
import { PlayerApiService } from "@src/services/player/PlayerApi.service";

export class PlayerStoreService {
  private store;
  private api:PlayerApiService;

  constructor(store = usePlayerStore(), api = new PlayerApiService()) {
    this.store = store;
    this.api = api;
  }

  getPlayerLevel(): number {
    return this.store.playerLevel;
  }
  syncPlayerLevel() {
    this.store.playerLevel = this.api.getPlayerLevel();
  }
}
