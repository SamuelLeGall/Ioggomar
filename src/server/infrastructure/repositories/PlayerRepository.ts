import { Document } from "@src/server/infrastructure/db/Document";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";

export class PlayerRepository {
  private database: Document<{ playerLevel: number }>;

  constructor(database = new LocalDatabase()) {
    this.database = database.player;
  }

  // TODO ATTENTION A CombatEntitiesService qui semble etre un peu comme ce playerRepository/service....
  // et semble avoir des méthodes mal placés ?

  /** Getters **/
  getPlayerLevel():number{
    return this.database.get().playerLevel;
  }

  updatePlayerLevel(nbLevelsToAdd:number){
    this.database.update((doc) => {
      return {
        ...doc,
        playerLevel: doc.playerLevel + nbLevelsToAdd,
      }
    });
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
