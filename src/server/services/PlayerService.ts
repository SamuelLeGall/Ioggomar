import { PlayerRepository } from "../repositories/PlayerRepository";

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
    return this.repository.getPlayerLevel();
  }
  updatePlayerLevel(nbLevelsToAdd:number):void{
    this.repository.updatePlayerLevel(nbLevelsToAdd);
  }

  exportPlayerState() {
    return this.repository.getPlayerStoreState();
  }

  initializePlayerState(data: any) {
    this.repository.setPlayerStoreState(data);
  }

  // player-specific actions
}
