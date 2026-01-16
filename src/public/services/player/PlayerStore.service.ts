import { usePlayerStore } from "@src/public/store/player";
import { PlayerApiService } from "@src/public/services/player/PlayerApi.service";
import { PlayerUI } from "@src/server/models/player/player.frontend.model";

export class PlayerStoreService {
  private store;
  private api: PlayerApiService;

  constructor(store = usePlayerStore(), api = new PlayerApiService()) {
    this.store = store;
    this.api = api;
  }

  getPlayer = (): PlayerUI => {
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
