import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import {
  questDifficulty,
  QuestGoalConfig,
  QuestGoalSubConfig,
  QuestItem,
  questPenalities,
  questRewards,
  questType,
} from "@src/models/quests/QuestsModels";

export class StaticQuestEntity {
  private quest: QuestItem;
  private difficulty: questDifficulty | null = null;
  constructor(quest: QuestItem) {
    this.quest = quest;
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
  public getQuestIllustration(): string {
    return this.quest.illustration;
  }

  public getQuestType(): questType {
    return this.quest.typeQuest;
  }
  public getQuestDifficulty(): Result<questDifficulty> {
    if (!this.difficulty) {
      return [
        null,
        new AppError(
          `No diffulty selected for quest found with id ${this.getQuestId()}`,
          AppErrorCodes.ACTION_NOT_ALLOWED_MISSING_DATA,
        ),
      ];
    }
    return [this.difficulty, null];
  }
  public getQuestConfigurations(): QuestGoalConfig[] {
    return this.quest.configs;
  }
  public getQuestConfigurationsByDifficultyASC(): QuestGoalConfig[] {
    return [...this.getQuestConfigurations()].sort(
      (questConfigA, questConfigB) => {
        return questConfigA.difficulty - questConfigB.difficulty;
      },
    );
  }
  public getQuestConfigurationsByDifficultyDESC(): QuestGoalConfig[] {
    return [...this.getQuestConfigurations()].sort(
      (questConfigA, questConfigB) => {
        return questConfigB.difficulty - questConfigA.difficulty;
      },
    );
  }
  public getQuestConfiguration(): Result<QuestGoalConfig> {
    const [difficulty, errorDifficulty] = this.getQuestDifficulty();
    if (errorDifficulty) {
      return [null, errorDifficulty];
    }

    const allConfigs = this.getQuestConfigurations();
    const selectedConfiguration = allConfigs.find(
      (el) => el.difficulty === difficulty,
    );
    if (!selectedConfiguration) {
      return [
        null,
        new AppError(
          `No configuration found for difficulty ${
            this.difficulty
          } in quest with id ${this.getQuestId()}`,
          AppErrorCodes.ACTION_NOT_ALLOWED_MISSING_DATA,
        ),
      ];
    }
    return [selectedConfiguration, null];
  }

  public haveQuestPenalities(): Result<boolean> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    return [Boolean(configuration.penalities), null];
  }

  public getQuestRewards(): Result<questRewards> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    return [configuration.rewards, null];
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

  public getQuestCompletionGoals(): Result<QuestGoalSubConfig[] | null> {
    const [configuration, errorGetConfig] = this.getQuestConfiguration();
    if (errorGetConfig) {
      return [null, errorGetConfig];
    }

    if (!configuration.goals) {
      return [null, null];
    }

    return [configuration.goals, null];
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

  /** Setters */
  public setDifficulty(difficulty: questDifficulty) {
    this.difficulty = difficulty;
  }
}
