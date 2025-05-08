import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { QuestItem, Quests } from "@src/models/quests/QuestsModels";
import { questsCollection } from "@src/server/infrastructure/db/quests";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
questsCollection.listQuests
export class StaticQuestRepository {
  private readonly listQuestsDB: Quests;
  constructor(database = questsCollection.listQuests) {
    this.listQuestsDB = database;
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

  private toEntity(data: QuestItem): StaticQuestEntity {
    return new StaticQuestEntity(data);
  }

  /** Public Getters */
  public getAll(): StaticQuestEntity[] {
    const result: StaticQuestEntity[] = [];
    this.listQuestsDB.forEach((questDB: QuestItem) => {
      result.push(this.toEntity(questDB));
    });
    return result;
  }

  public getById(questId: string): Result<StaticQuestEntity> {
    const selectedQuest = this.getAll().find((quest: StaticQuestEntity) => {
      return quest.getQuestId() === questId;
    });
    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND
        ),
      ];
    }

    return [selectedQuest, null];
  }
}
