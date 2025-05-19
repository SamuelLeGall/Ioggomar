import { GameService } from "@src/server/application/game.service";
import { OptionConfig } from "@src/models/BasicAndTempModels";

export class GameApiService {
  private backendService: GameService;

  constructor(backendService = new GameService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
  }

  /** GETTERS */
  getCurrentLocalization() {
    return this.backendService.getCurrentLocalization()
  }

  getCurrentTheme() {
    return this.backendService.getCurrentTheme()
  }

  /** MUTATIONS */
  changeLocalization(newLocalization: OptionConfig) {
    this.backendService.changeLocalization(newLocalization);
  }

  changeTheme(newTheme: OptionConfig) {
    this.backendService.changeTheme(newTheme);
  }

  public async save(){
// TODO
  }

  public async load(){
// TODO

  }

  }
