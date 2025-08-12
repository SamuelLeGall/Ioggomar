import { ActiveQuest } from "@src/models/quests/QuestsModels";
import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { ActiveQuestEntity } from "@src/server/domain/entities/OnGoingQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Collection } from "@src/server/infrastructure/db/Collection";

export class ActiveQuestRepository {
  private database: Collection<ActiveQuest>;

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

  private toEntity(data: ActiveQuest): ActiveQuestEntity {
    return ActiveQuestEntity.fromData(data);
  }

  /** Public Getters */
  public getAll(): ActiveQuestEntity[] {
    const result: ActiveQuestEntity[] = [];
    this.database.getAll().forEach((questDB: ActiveQuest) => {
      result.push(this.toEntity(questDB));
    });
    return result;
  }

  public getById(questId: string): Result<ActiveQuestEntity> {
    const selectedQuest = this.database.getById(questId);
    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No active quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    return [this.toEntity(selectedQuest), null];
  }

  public removeById(questId: string): Result<true> {
    this.database.remove(questId)

    return [true, null];
  }

  public insert(quest: ActiveQuestEntity): Result<true> {
    this.database.add(this.toDB(quest))

    return [true, null];
  }

  public updateById(
    questId: string,
    questUpdated: ActiveQuestEntity
  ): Result<true> {
    const selectedQuestIndex = this.getAll().findIndex(
      (quest: ActiveQuestEntity) => {
        return quest.getId() === questId;
      }
    );
    if (selectedQuestIndex === -1) {
      return [
        null,
        new AppError(
          `No active quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    this.database.update(questId, this.toDB(questUpdated))

    return [true, null];
  }

  /** DON'T use this method except when loading/saving the game   */
  public restoreDefault():Result<true>{
    this.database._forceReset();
    return [true, null];
  }
}