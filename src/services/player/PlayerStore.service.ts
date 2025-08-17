import { usePlayerStore } from "@src/store/player";
import { PlayerApiService } from "@src/services/player/PlayerApi.service";
import { PlayerForFrontend } from "@src/models/player/PlayerModels";

export class PlayerStoreService {
  private store;
  private api: PlayerApiService;

  constructor(store = usePlayerStore(), api = new PlayerApiService()) {
    this.store = store;
    this.api = api;
  }

  getPlayer = (): PlayerForFrontend => {
    return this.store.player;
  };
  syncPlayer = () => {
    const newValue = this.api.getPlayer();
    if (!newValue) {
      return;
    }
    this.store.player = newValue;
  };
}
