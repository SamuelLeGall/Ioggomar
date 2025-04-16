import { AppError, AppErrorCodes, Result } from "@src/models/BasicAndTempModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { CombatantsRepository } from "./Combatants/CombatantsRepository";
import { playerCollection } from "@src/server/database/player";

export class PlayerRepository {
  private collection;
  private combatantsRepository;

  constructor(collection = playerCollection) {
    this.collection = collection;
    this.combatantsRepository = new CombatantsRepository();
  }

  // TODO ATTENTION A CombatEntitiesService qui semble etre un peu comme ce playerRepository/service....
  // et semble avoir des méthodes mal placés ?

  /** Getters **/
  getPlayer(): Result<Combatant> {
    const currentCombatant = this.combatantsRepository
      .getAllCombatants()
      .find((combatant) => {
        return combatant.type === "PLAYER";
      });

    if (!currentCombatant) {
      return [
        null,
        new AppError("Can't find the player", AppErrorCodes.RESOURCE_NOT_FOUND),
      ];
    }

    return [currentCombatant, null];
  }

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
