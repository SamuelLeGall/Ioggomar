import {
  ErrorFactory,
  Result,
  ResultFactory,
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

  public getQuestAvailableDifficulties(): questDifficulty[] {
    return this.getQuestConfigurations().map((el) => el.difficulty);
  }

  public haveDifficultySelected(): boolean {
    return this.difficulty !== null;
  }

  public getQuestDifficulty(): Result<questDifficulty> {
    if (!this.difficulty) {
      return [null, ErrorFactory.questDifficultyNotSet(this.getQuestId())];
    }
    return [this.difficulty, null];
  }
  public getQuestConfigurations(): QuestGoalConfig[] {
    return this.quest.configs;
  }
  public getQuestConfigurationsByDifficultyASC(): Result<QuestGoalConfig[]> {
    try {
      return [
        [...this.getQuestConfigurations()].sort(
          (questConfigA, questConfigB) =>
            questConfigA.difficulty - questConfigB.difficulty,
        ),
        null,
      ];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext(
            "Entity",
            "getQuestConfigurationsByDifficultyASC",
            {
              questId: this.getQuestId(),
            },
          ),
          e,
        ),
      ];
    }
  }
  public getQuestConfigurationsByDifficultyDESC(): Result<QuestGoalConfig[]> {
    try {
      return [
        [...this.getQuestConfigurations()].sort(
          (questConfigA, questConfigB) =>
            questConfigB.difficulty - questConfigA.difficulty,
        ),
        null,
      ];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext(
            "Entity",
            "getQuestConfigurationsByDifficultyDESC",
            {
              questId: this.getQuestId(),
            },
          ),
          e,
        ),
      ];
    }
  }

  public getQuestConfiguration(): Result<QuestGoalConfig> {
    try {
      const resultGetDifficulty = this.getQuestDifficulty();
      if (ResultFactory.isError(resultGetDifficulty)) {
        const [, errorDifficulty] = resultGetDifficulty;
        return [
          null,
          ErrorFactory.chainError(
            errorDifficulty,
            ErrorFactory.createContext("Entity", "getQuestConfiguration", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [difficulty] = resultGetDifficulty;

      const allConfigs = this.getQuestConfigurations();
      const selectedConfiguration = allConfigs.find(
        (el) => el.difficulty === difficulty,
      );
      if (!selectedConfiguration) {
        return [
          null,
          ErrorFactory.questDifficultyNotAvailable(
            this.getQuestId(),
            difficulty,
          ),
        ];
      }
      return [selectedConfiguration, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestConfiguration", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public haveQuestPenalities(): Result<boolean> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "haveQuestPenalities", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      return [Boolean(configuration.penalities), null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "haveQuestPenalities", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestRewards(): Result<questRewards> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "getQuestRewards", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      return [configuration.rewards, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestRewards", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestPenalities(): Result<questPenalities | null> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "getQuestPenalities", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      if (!configuration.penalities) {
        // there may not be any penality for some quests, so not an error.
        return [null, null];
      }

      return [configuration.penalities, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestPenalities", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestCompletionGoals(): Result<QuestGoalSubConfig[] | null> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "getQuestCompletionGoals", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      if (!configuration.goals) {
        return [null, null];
      }

      return [configuration.goals, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestCompletionGoals", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestGold(): Result<number> {
    try {
      const resultGetRewards = this.getQuestRewards();
      if (ResultFactory.isError(resultGetRewards)) {
        const [, errorGetRewards] = resultGetRewards;
        return [
          null,
          ErrorFactory.chainError(
            errorGetRewards,
            ErrorFactory.createContext("Entity", "getQuestGold", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [rewards] = resultGetRewards;

      return [rewards.gold, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestGold", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestXP(): Result<number> {
    try {
      const resultGetRewards = this.getQuestRewards();
      if (ResultFactory.isError(resultGetRewards)) {
        const [, errorGetRewards] = resultGetRewards;
        return [
          null,
          ErrorFactory.chainError(
            errorGetRewards,
            ErrorFactory.createContext("Entity", "getQuestXP", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [rewards] = resultGetRewards;

      return [rewards.xp, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestXP", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  /** Setters */
  public setDifficulty(difficulty: questDifficulty) {
    this.difficulty = difficulty;
  }
}
