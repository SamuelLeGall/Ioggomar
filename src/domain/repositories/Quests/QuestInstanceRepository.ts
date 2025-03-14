import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/domain/models/BasicAndTempModels";
import {
  questDifficulty,
  QuestGoalConfig,
  QuestItem,
  questPenalities,
  questRewards,
} from "@src/domain/models/quests/QuestsModels";
import { QuestsRepository } from "./QuestsRepository";

export class QuestInstanceRepository {
  private quest: QuestItem;
  private difficulty: questDifficulty | null = null;
  constructor(questId: string, instanceQuestsRepo: QuestsRepository) {
    const [quest, errorGetQuest] = instanceQuestsRepo.getQuestById(questId);
    if (!quest) {
      throw errorGetQuest;
    }

    this.quest = quest;
  }

  /** Private Getters */
  private getQuestConfigurations(): QuestGoalConfig[] {
    return this.quest.configs;
  }

  /** Public Getters */
  public getQuestId(): string {
    return this.quest.id;
  }
  public getQuestLocationId(): string {
    return this.quest.locationId;
  }
  public getQuestName(): string {
    return this.quest.name;
  }
  public getQuestDescription(): string {
    return this.quest.description;
  }
  public getQuestType(): string {
    return this.quest.typeQuest;
  }
  public getQuestDifficulty(): Result<questDifficulty> {
    if (!this.difficulty) {
      return [
        null,
        new AppError(
          `No diffulty selected for quest found with id ${this.getQuestId()}`,
          AppErrorCodes.ACTION_NOT_ALLOWED_MISSING_DATA
        ),
      ];
    }
    return [this.difficulty, null];
  }
  public getQuestConfigurationsByDifficultyASC(): QuestGoalConfig[] {
    return [...this.getQuestConfigurations()].sort(
      (questConfigA, questConfigB) => {
        return questConfigA.difficulty - questConfigB.difficulty;
      }
    );
  }
  public getQuestConfigurationsByDifficultyDESC(): QuestGoalConfig[] {
    return [...this.getQuestConfigurations()].sort(
      (questConfigA, questConfigB) => {
        return questConfigB.difficulty - questConfigA.difficulty;
      }
    );
  }
  public getQuestConfiguration(): Result<QuestGoalConfig> {
    const [difficulty, errorDifficulty] = this.getQuestDifficulty();
    if (errorDifficulty) {
      return [null, errorDifficulty];
    }

    const allConfigs = this.getQuestConfigurations();
    const selectedConfiguration = allConfigs.find(
      (el) => el.difficulty === difficulty
    );
    if (!selectedConfiguration) {
      return [
        null,
        new AppError(
          `No configuration found for difficulty ${
            this.difficulty
          } in quest with id ${this.getQuestId()}`,
          AppErrorCodes.ACTION_NOT_ALLOWED_MISSING_DATA
        ),
      ];
    }
    return [selectedConfiguration, null];
  }

  private getQuestRewards(): Result<questRewards> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    return [configuration.rewards, null];
  }
  public getQuestGold(): Result<number> {
    const [rewards, errorGetRewards] = this.getQuestRewards();
    if (errorGetRewards) {
      return [null, errorGetRewards];
    }

    return [rewards.gold, null];
  }
  public getQuestXP(): Result<number> {
    const [rewards, errorGetRewards] = this.getQuestRewards();
    if (errorGetRewards) {
      return [null, errorGetRewards];
    }

    return [rewards.xp, null];
  }

  public haveQuestPenalities(): Result<boolean> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    return [Boolean(configuration.penalities), null];
  }
  public getQuestPenalities(): Result<questPenalities | null> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    if (!configuration.penalities) {
      return [null, null];
    }

    return [configuration.penalities, null];
  }

  /** Setters */
  public setDifficulty(difficulty: questDifficulty) {
    this.difficulty = difficulty;
  }
}
