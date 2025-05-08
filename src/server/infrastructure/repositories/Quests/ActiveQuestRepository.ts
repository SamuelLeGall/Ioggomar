import { ActiveQuest, ActiveQuests } from "@src/models/quests/QuestsModels";
import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { ActiveQuestEntity } from "@src/server/domain/entities/OnGoingQuestEntity";

export class ActiveQuestRepository {
  private storage: Storage;
  private keyDB = "activeQuests";

  constructor(localStorageParam = localStorage) {
    this.storage = localStorageParam;
  }

  /** Private Getters */
  private getActiveQuestsDB(): ActiveQuests {
    const questsDB = this.storage.getItem(this.keyDB);
    if (questsDB && Array.isArray(JSON.parse(questsDB))) {
      return JSON.parse(questsDB);
    }

    return [];
  }

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
    this.getActiveQuestsDB().forEach((questDB: ActiveQuest) => {
      result.push(this.toEntity(questDB));
    });
    return result;
  }

  public getById(questId: string): Result<ActiveQuestEntity> {
    const selectedQuest = this.getAll().find((quest: ActiveQuestEntity) => {
      return quest.getId() === questId;
    });
    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No active quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    return [selectedQuest, null];
  }

  public removeById(questId: string): Result<true> {
    const updated = this.getAll()
      .filter((quest: ActiveQuestEntity) => {
        return quest.getId() !== questId;
      })
      .map((questEntity) => this.toDB(questEntity));

    // we update the DB
    this.storage.setItem(this.keyDB, JSON.stringify(updated));

    return [true, null];
  }

  public insert(quest: ActiveQuestEntity): Result<true> {
    const quests = this.getActiveQuestsDB();
    quests.push(this.toDB(quest));

    // we update the DB
    this.storage.setItem(this.keyDB, JSON.stringify(quests));
    this.getActiveQuestsDB();

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

    const state = this.getActiveQuestsDB();
    state[selectedQuestIndex] = this.toDB(questUpdated);

    // we update the DB
    this.storage.setItem(this.keyDB, JSON.stringify(state));

    return [true, null];
  }
}