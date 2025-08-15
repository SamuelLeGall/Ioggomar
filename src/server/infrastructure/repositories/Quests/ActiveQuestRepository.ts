import { ActiveQuest } from "@src/models/quests/QuestsModels";
import {
  AppErrorCodes,
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import { ActiveQuestEntity } from "@src/server/domain/entities/ActiveQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Collection } from "@src/server/infrastructure/db/Collection";

export class ActiveQuestRepository {
  private database: Collection<ActiveQuest>;
  private readonly instanceName = "ActiveQuestRepository";

  constructor(database = new LocalDatabase()) {
    this.database = database.activeQuests;
  }

  /** Private Getters */
  private toDB(entity: ActiveQuestEntity): ActiveQuest {
    return {
      id: entity.getId(),
      staticQuestId: entity.getStaticQuestId(),
      difficultyChosen: entity.getDifficultyChosen(),
      data: entity.getProgress(),
    };
  }

  private toEntity(data: ActiveQuest): Result<ActiveQuestEntity> {
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

      const dbResult = this.database.getAll();
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [activeQuests] = dbResult;

      const entities: ActiveQuestEntity[] = [];
      for (const activeQuest of activeQuests) {
        const entityResult = this.toEntity(activeQuest);
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

  public getById(questId: string): Result<ActiveQuestEntity> {
    try {
      const context = ErrorFactory.createContext("Repository", "getById", {
        questUUID: questId,
        instanceName: this.instanceName,
      });

      const dbResult = this.database.getById(questId);
      if (ResultFactory.isError(dbResult)) {
        const [, error] = dbResult;
        return [null, ErrorFactory.chainError(error, context)];
      }
      const [activeQuest] = dbResult;

      if (!activeQuest) {
        return [
          null,
          ErrorFactory.resourceNotFound(context, "activeQuest", questId),
        ];
      }

      return this.toEntity(activeQuest);
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Repository", "getById", {
            questUUID: questId,
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
