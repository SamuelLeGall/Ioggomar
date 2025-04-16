import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { combatantsCollection } from "@src/server/database/combatants";

export class CombatantsRepository {
  private database;

  constructor(database = combatantsCollection) {
    this.database = database;
  }

  /** Getters **/
  getAllCombatants(): Combatant[] {
    return this.database.combatants;
  }

  getAllEnnemies(): Combatant[] {
    return this.getAllCombatants().filter((combatant) => {
      return combatant.type === "ENNEMY";
    });
  }

  getAllAllies(): Combatant[] {
    return this.getAllCombatants().filter((combatant) => {
      return combatant.type === "ALLY";
    });
  }
  /**
   * Fetch a single combatant from the list. Use only for scoping.
   * Any logic related to a single combatant MUST go into CombatantInstanceRepository.
   */
  getCombatantById(combatantId: string): Result<Combatant> {
    const currentCombatant = this.database.combatants.find((combatant) => {
      return combatant.id === combatantId;
    });

    if (!currentCombatant) {
      return [
        null,
        new AppError(
          "Can't find the combatant for this Id",
          AppErrorCodes.RESOURCE_NOT_FOUND
        ),
      ];
    }

    return [currentCombatant, null];
  }

  /** Technical Actions - no actual high level user-action at this level **/
  // player stats, equiped equipement/items are not taken into account here

  getCombatantStoreState() {
    return { combatants: this.database.combatants };
  }

  setCombatantStoreState(data: Combatant[]) {
    // TODO
    this.database.combatants = data;
  }
}
