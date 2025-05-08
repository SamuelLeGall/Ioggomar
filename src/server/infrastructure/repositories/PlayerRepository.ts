import { playerCollection } from "@src/server/infrastructure/db/player";

export class PlayerRepository {
  private collection;

  constructor(collection = playerCollection) {
    this.collection = collection;
  }

  // TODO ATTENTION A CombatEntitiesService qui semble etre un peu comme ce playerRepository/service....
  // et semble avoir des méthodes mal placés ?

  /** Getters **/
  getPlayerLevel():number{
    return this.collection.playerLevel;
  }

  updatePlayerLevel(nbLevelsToAdd:number){
    this.collection.playerLevel += nbLevelsToAdd;
  }

  /** Technical Actions - no actual high level user-action at this level **/
  engageDiscussion() {
    // TODO (ceci est une fonction example)
  }

  getPlayerStoreState() {
    return {};
  }
  setPlayerStoreState(data: any) {
    // TODO
  }
}
