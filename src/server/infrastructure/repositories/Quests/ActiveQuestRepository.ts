import {
  AppErrorCodes,
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { ActiveQuestEntity } from "@src/server/domain/entities/ActiveQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { BaseCollectionRepository } from "@src/server/infrastructure/repositories/BaseCollectionRepository";
import { ActiveQuest } from "@src/server/models/quests/quest.db.model";

export class ActiveQuestRepository extends BaseCollectionRepository<
  ActiveQuest,
  ActiveQuestEntity
> {
  protected readonly instanceName = "ActiveQuestRepository";

  constructor(database = new LocalDatabase()) {
    super(database.activeQuests);
  }

  /** Private Getters */
  protected toDB(entity: ActiveQuestEntity): ActiveQuest {
    return {
      id: entity.getId(),
      staticQuestId: entity.getStaticQuestId(),
      difficultyChosen: entity.getDifficultyChosen(),
      data: entity.getProgress(),
    };
  }
  protected toEntity(data: ActiveQuest): Result<ActiveQuestEntity> {
    try {
      const entity = ActiveQuestEntity.fromData(data);
      return [entity, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "toEntity", {
            activeQuestId: data.id,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  /** Public Getters */
  public getAll(): Result<ActiveQuestEntity[]> {
    try {
      const context = ErrorFactory.createContext("Repository", "getAll", {
        instanceName: this.instanceName,
      });

      const dbResult = this.find({});
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [activeQuests] = dbResult;

      return [activeQuests, null];
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
  public getById(questId: string): Result<ActiveQuestEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "getById", {
        uuid: questId,
        instanceName: this.instanceName,
      });

      const resultGetId = this.findOne({ id: questId });
      if (ResultFactory.isError(resultGetId)) {
        const [, error] = resultGetId;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [activeQuest] = resultGetId;

      if (!activeQuest) {
        return [
          null,
          ErrorFactory.resourceNotFound(context, "activeQuest", questId),
        ];
      }

      return [activeQuest, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getById", {
            uuid: questId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
  public getByStaticId(
    staticQuestId: string,
  ): Result<ActiveQuestEntity | null> {
    try {
      const context = ErrorFactory.createContext(
        "Repository",
        "getByStaticId",
        {
          staticQuestId,
          instanceName: this.instanceName,
        },
      );

      const dbResult = this.findOne({
        staticQuestId,
      });
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [activeQuest] = dbResult;

      return [activeQuest, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getByStaticId", {
            staticQuestId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public remove(questId: string): Result<true> {
    try {
      const context = ErrorFactory.createContext("Repository", "remove", {
        questUUID: questId,
        instanceName: this.instanceName,
      });

      const removeResult = this.database.remove(questId);
      if (ResultFactory.isError(removeResult)) {
        const [, error] = removeResult;
        return [null, ErrorFactory.chainError(error, context)];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "remove", {
            questUUID: questId,
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }

  public save(entity: ActiveQuestEntity): Result<ActiveQuestEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "save", {
        questUUID: entity.getId(),
        staticQuestId: entity.getStaticQuestId(),
        instanceName: this.instanceName,
      });

      const dbItem = this.toDB(entity);

      // Try update first
      const updateResult = this.database.update(entity.getId(), dbItem);
      if (ResultFactory.isSuccess(updateResult)) {
        return [entity, null];
      }

      // If update failed because item doesn't exist, try add
      const [, updateError] = updateResult;
      if (updateError.code === AppErrorCodes.RESOURCE_NOT_FOUND) {
        const addResult = this.database.add(dbItem);
        if (ResultFactory.isError(addResult)) {
          const [, error] = addResult;
          return [null, ErrorFactory.chainError(error, context)];
        }
        return [entity, null];
      }

      // Other error, chain it
      return [null, ErrorFactory.chainError(updateError, context)];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "save", {
            questUUID: entity.getId(),
            staticQuestId: entity.getStaticQuestId(),
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
