import { GameService } from "@src/server/application/game.service";

export class GameContextApiService {
  private backendService: GameService;

  constructor(backendService = new GameService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
  }

  /** MUTATIONS */
  public initialize() {
    this.backendService.initialize();
  }

  public reset() {
    this.backendService.initialize();
  }

  public resume() {
    this.backendService.resume();
  }

  public async save() {
    await this.backendService.save();
  }

  public async load(): Promise<boolean> {
    const result = await this.backendService.load();
    if (result) {
      alert("Game loaded successfully.");
    }
    return result;
  }
}
