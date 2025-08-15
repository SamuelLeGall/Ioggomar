import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { QuestItem } from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Collection } from "@src/server/infrastructure/db/Collection";

export class StaticQuestRepository {
  private readonly database: Collection<QuestItem>;
  private readonly instanceName = "StaticQuestRepository";
  constructor(database = new LocalDatabase()) {
    this.database = database.quests;
  }
  /** Private Getters */
  private toDB(entity: StaticQuestEntity): QuestItem {
    return {
      id: entity.getQuestId(),
      locationId: entity.getQuestLocationId(),
      name: entity.getQuestName(),
      illustration: entity.getQuestIllustration(),
      description: entity.getQuestDescription(),
      typeQuest: entity.getQuestType(),
      configs: entity.getQuestConfigurations(),
    };
  }

  private toEntity(data: QuestItem): Result<StaticQuestEntity> {
    try {
      const entity = new StaticQuestEntity(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            questId: data.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** Public Getters */
  public getAll(): Result<StaticQuestEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "getAll", {
        instanceName: this.instanceName,
      });

      // Get raw data from database
      const dbResult = this.database.getAll();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [questItems] = dbResult;

      // Transform to entities
      const entities: StaticQuestEntity[] = [];
      for (const questItem of questItems) {
        const entityResult = this.toEntity(questItem);
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
          ErrorFactory.createContext("Repository", "getAll", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public getById(questId: string): Result<StaticQuestEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "getById", {
        questId,
        instanceName: this.instanceName,
      });

      // Get from database
      const dbResult = this.database.getById(questId);
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [questItem] = dbResult;

      // Check if found
      if (!questItem) {
        return [null, ErrorFactory.resourceNotFound(context, "quest", questId)];
      }

      // Transform to entity
      const entityResult = this.toEntity(questItem);
      if (ResultFactory.isError(entityResult)) {
        const [, error] = entityResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [staticQuest] = entityResult;

      return [staticQuest, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getById", {
            questId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** DON'T use this method except when loading/saving the game   */
  public restoreDefault(): Result<true> {
    try {
      const resetResult = this.database._forceReset();
      if (ResultFactory.isError(resetResult)) {
        const [, error] = resetResult;
        return [
          null,
          ErrorFactory.chainError(
            error,
            ErrorFactory.createContext("Repository", "restoreDefault", {
              instanceName: this.instanceName,
            }),
          ),
        ];
      }
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "restoreDefault", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
