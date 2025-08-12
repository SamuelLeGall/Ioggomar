import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { QuestItem } from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { Collection } from "@src/server/infrastructure/db/Collection";

export class StaticQuestRepository {
  private readonly database: Collection<QuestItem>;
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

  private toEntity(data: QuestItem): StaticQuestEntity {
    return new StaticQuestEntity(data);
  }

  /** Public Getters */
  public getAll(): StaticQuestEntity[] {
    const result: StaticQuestEntity[] = [];
    this.database.getAll().forEach((questDB: QuestItem) => {
      result.push(this.toEntity(questDB));
    });
    return result;
  }

  public getById(questId: string): Result<StaticQuestEntity> {
    const selectedQuest = this.database.getById(questId);
    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND,
        ),
      ];
    }

    return [this.toEntity(selectedQuest), null];
  }

  /** DON'T use this method except when loading/saving the game   */
  public restoreDefault(): Result<true> {
    this.database._forceReset();

    return [true, null];
  }
}
