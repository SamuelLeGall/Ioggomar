import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { BaseCollectionRepository } from "@src/server/infrastructure/repositories/BaseCollectionRepository";
import { QuestItem } from "@src/models/quests/quest.db.model";

export class StaticQuestRepository extends BaseCollectionRepository<
  QuestItem,
  StaticQuestEntity
> {
  protected readonly instanceName = "StaticQuestRepository";
  constructor(database = new LocalDatabase()) {
    super(database.quests); // Pass the specific collection
  }

  /** Private Getters */
  protected toDB(entity: StaticQuestEntity): QuestItem {
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
  protected toEntity(data: QuestItem): Result<StaticQuestEntity> {
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
      const dbResult = this.find({});
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [quests] = dbResult;

      return [quests, null];
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
      const dbResult = this.findOne({ id: questId });
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [questItem] = dbResult;

      // Check if found
      if (!questItem) {
        return [null, ErrorFactory.resourceNotFound(context, "quest", questId)];
      }

      return [questItem, null];
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
}
