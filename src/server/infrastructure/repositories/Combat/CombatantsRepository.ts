import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { CombatantEntity } from "@src/server/domain/entities/combatantEntity";

export class CombatantsRepository {
  private database: Collection<Combatant>;
  private readonly instanceName = "CombatantsRepository";

  constructor(database = new LocalDatabase()) {
    this.database = database.combatants;
  }

  /** Private Getters */
  private toDB(entity: CombatantEntity): Combatant {
    return {
      id: entity.getId(),
      type: entity.getType(),
      name: entity.getName(),
      element: entity.getElementalType(),
      baseStats: entity.getBaseStats(),
      level: entity.getLevel(),
      exp: entity.getXp(),
      equipementSlots: entity.getEquipments(),
    };
  }

  private toEntity(data: Combatant): Result<CombatantEntity> {
    try {
      const entity = CombatantEntity.fromData(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            id: data.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** Getters **/
  getAllCombatants(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getAllCombatants",
        {
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.database.getAll();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [combatants] = dbResult;

      const entities: CombatantEntity[] = [];
      for (const combatant of combatants) {
        const entityResult = this.toEntity(combatant);
        if (ResultFactory.isError(entityResult)) {
          const [, error] = entityResult;
          return [null, ErrorFactory.chainError(error, context)];
        }
        const [entity] = entityResult;
        entities.push(entity);
      }

      return [entities, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getAllCombatants", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  getAllEnnemies(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getAllEnnemies",
        {
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.getAllCombatants();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [combatants] = dbResult;

      const ennemies = combatants.filter((combatant) => {
        return combatant.getType() === "ENNEMY";
      });

      return [ennemies, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getAllEnnemies", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  getAllAllies(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "getAllAllies", {
        instanceName: this.instanceName,
      });

      const dbResult = this.getAllCombatants();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [combatants] = dbResult;

      const ennemies = combatants.filter((combatant) => {
        return combatant.getType() === "ALLY";
      });

      return [ennemies, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getAllAllies", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /**
   * Fetch a single combatant from the list. Use only for scoping.
   * Any logic related to a single combatant MUST go into CombatantInstanceRepository.
   */
  public getCombatantById(combatantId: string): Result<CombatantEntity> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getCombatantById",
        {
          id: combatantId,
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.database.getById(combatantId);
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [currentCombatant] = dbResult;

      if (!currentCombatant) {
        return [
          null,
          ErrorFactory.resourceNotFound(context, "combatant", combatantId),
        ];
      }

      return this.toEntity(currentCombatant);
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getCombatantById", {
            questUUID: combatantId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
