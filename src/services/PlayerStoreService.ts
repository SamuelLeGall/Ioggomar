import { usePlayerStore } from "@src/store/player";
import { PlayerApiService } from "@src/services/PlayerApiService";

export class PlayerStoreService {
  private store;
  private api;

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
