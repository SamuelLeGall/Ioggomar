import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { Combatant } from "@src/server/models/entitiesStats/CombatantModels";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { CombatantEntity } from "@src/server/domain/entities/combatantEntity";
import { BaseCollectionRepository } from "@src/server/infrastructure/repositories/BaseCollectionRepository";

export class CombatantsRepository extends BaseCollectionRepository<
  Combatant,
  CombatantEntity
> {
  protected readonly instanceName = "CombatantsRepository";

  constructor(database = new LocalDatabase()) {
    super(database.combatants);
  }

  /** Private Getters */
  protected toDB(entity: CombatantEntity): Combatant {
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
  protected toEntity(data: Combatant): Result<CombatantEntity> {
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
  public getAllCombatants(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getAllCombatants",
        {
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.find({});
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [combatants] = dbResult;

      return [combatants, null];
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
  public getAllEnnemies(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getAllEnnemies",
        {
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.find({
        type: "ENNEMY",
      });
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [ennemies] = dbResult;

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
  public getAllAllies(): Result<CombatantEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "getAllAllies", {
        instanceName: this.instanceName,
      });

      const dbResult = this.find({
        type: "ALLY",
      });
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [allies] = dbResult;

      return [allies, null];
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

      const dbResult = this.findOne({ id: combatantId });
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

      return [currentCombatant, null];
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
