import { PlayerService } from "@src/server/services/PlayerService";

export class PlayerApiService {
  private backendService: PlayerService;

  constructor(backendService = new PlayerService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
  }

  getPlayerLevel(): number {
    return this.backendService.getPlayerLevel();
  }
  updatePlayerLevel(nbLevelsToAdd: number): void {
    this.backendService.updatePlayerLevel(nbLevelsToAdd);
  }

  // player-specific actions
}
