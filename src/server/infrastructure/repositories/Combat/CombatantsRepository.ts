import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { CombatantEntity } from "@src/server/domain/entities/combatantEntity";

export class CombatantsRepository {
  private database:Collection<Combatant>;

  constructor(database = new LocalDatabase()) {
    this.database = database.combatants;
  }

  /** Private Getters */
  private toDB(entity: CombatantEntity): Combatant {
    return {
      id: entity.getId(),
      type:entity.getType(),
      name: entity.getName(),
      element: entity.getElementalType(),
      baseStats: entity.getBaseStats(),
      level: entity.getLevel(),
      exp: entity.getXp(),
      equipementSlots: entity.getEquipments()
    };
  }

  private toEntity(data: Combatant): CombatantEntity {
    return CombatantEntity.fromData(data);
  }

  /** Getters **/
  getAllCombatants(): CombatantEntity[] {
    const combatants: CombatantEntity[] = [];
    this.database.getAll().forEach((combatant: Combatant) => {
      combatants.push(this.toEntity(combatant))
    });
    return combatants;
  }

  getAllEnnemies(): CombatantEntity[] {
    return this.getAllCombatants().filter((combatant) => {
      return combatant.getType() === "ENNEMY";
    });
  }

  getAllAllies(): CombatantEntity[] {
    return this.getAllCombatants().filter((combatant) => {
      return combatant.getType() === "ALLY";
    });
  }

  /**
   * Fetch a single combatant from the list. Use only for scoping.
   * Any logic related to a single combatant MUST go into CombatantInstanceRepository.
   */
  getCombatantById(combatantId: string): Result<CombatantEntity> {
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

    return [this.toEntity(currentCombatant), null];
  }
}
