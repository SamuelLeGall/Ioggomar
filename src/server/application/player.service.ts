import { PlayerRepository } from "@src/server/infrastructure/repositories/PlayerRepository";

export class PlayerService {
  private repository: PlayerRepository;

  constructor(repository = new PlayerRepository()) {
    this.repository = repository;
  }

  engageDiscussion() {
    // TODO
    return true;
  }

  getPlayerLevel():number{
    try {
      return this.repository.getPlayerLevel();
    }catch (e) {
      console.error("getPlayerLevel - unexpected error:", e);
      return 0;
    }
  }
  updatePlayerLevel(nbLevelsToAdd:number):void{
    try {
      this.repository.updatePlayerLevel(nbLevelsToAdd);
    }catch (e) {
      console.error("updatePlayerLevel - unexpected error:", e);
    }
  }

  // exportPlayerState() {
  //   return this.repository.getPlayerStoreState();
  // }
  //
  // initializePlayerState(data: any) {
  //   this.repository.setPlayerStoreState(data);
  // }

  // player-specific actions
}
