import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";

export class CombatantsRepository {
  private database:Collection<Combatant>;

  constructor(database = new LocalDatabase()) {
    this.database = database.combatants;
  }

  /** Getters **/
  getAllCombatants(): Combatant[] {
    return this.database.getAll();
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
    const currentCombatant = this.database.getById(combatantId);

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

  // getCombatantStoreState() {
  //   return { combatants: this.database.combatants };
  // }
  //
  // setCombatantStoreState(data: Combatant[]) {
  //   // TODO
  //   this.database.combatants = data;
  // }
}
