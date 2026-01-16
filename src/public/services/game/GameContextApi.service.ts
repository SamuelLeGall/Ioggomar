import { GameService } from "@src/server/application/game.service";
import { useToast } from "vue-toast-notification";
import { ResultFactory } from "@src/server/models/BasicAndTempModels";

export class GameContextApiService {
  private backendService: GameService;
  private toast;

  constructor(backendService = new GameService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
    this.toast = useToast({
      position: "top-right",
      duration: 1500,
    });
  }

  /** MUTATIONS */
  public initialize = (): boolean => {
    const result = this.backendService.initialize();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }

    return true;
  };

  public reset = (): boolean => {
    const result = this.backendService.initialize();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }

    return true;
  };

  public resume = (): boolean => {
    const result = this.backendService.resume();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }

    return true;
  };

  public save = async (): Promise<boolean> => {
    const result = await this.backendService.save();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }

    this.toast.success("Game saved successfully.");
    return true;
  };

  public load = async (): Promise<boolean> => {
    const result = await this.backendService.load();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }

    this.toast.success("Game loaded successfully.");
    return true;
  };
}
