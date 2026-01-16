import { PlayerService } from "@src/server/application/player.service";
import { ResultFactory } from "@src/server/models/BasicAndTempModels";
import { useToast } from "vue-toast-notification";
import { PlayerUI } from "@src/server/models/player/player.frontend.model";

export class PlayerApiService {
  private backendService: PlayerService;
  private toast;

  constructor(backendService = new PlayerService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
    this.toast = useToast({
      position: "top-right",
      duration: 1500,
    });
  }

  getPlayer = (): PlayerUI | undefined => {
    const result = this.backendService.getPlayer();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [player] = result;
    return player;
  };

  levelUp = (nbLevelsToAdd: number): boolean => {
    const result = this.backendService.levelUp(nbLevelsToAdd);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;
    return Boolean(success);
  };

  // player-specific actions
}
