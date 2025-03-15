import { usePlayerStore } from "../database-stores/player";
import { AppError, AppErrorCodes, Result } from "../models/BasicAndTempModels";
import { Combatant } from "../models/entitiesStats/CombatantModels";
import { CombatantsRepository } from "./Combatants/CombatantsRepository";

export class PlayerRepository {
  private store;
  private combatantsRepository;

  constructor(store = usePlayerStore()) {
    this.store = store;
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
