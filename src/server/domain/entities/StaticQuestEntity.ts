import { ErrorFactory, Result } from "@src/models/BasicAndTempModels";
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
      const [difficulty, errorDifficulty] = this.getQuestDifficulty();
      if (errorDifficulty) {
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
      const [configuration, errorGetConfig] = this.getQuestConfiguration();
      if (errorGetConfig) {
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
      const [configuration, errorGetConfig] = this.getQuestConfiguration();
      if (errorGetConfig) {
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
      const [configuration, errorGetConfig] = this.getQuestConfiguration();
      if (errorGetConfig) {
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

      if (!configuration.penalities) {
        // there may not be any penality for some quests, not an error.
        // @Claude: i think there is no way to know if an error happen here or if it normal. I guess if an error happen it would be the getConfig above ?
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
      const [configuration, errorGetConfig] = this.getQuestConfiguration();
      if (errorGetConfig) {
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
      const [rewards, errorGetRewards] = this.getQuestRewards();
      if (errorGetRewards) {
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
      const [rewards, errorGetRewards] = this.getQuestRewards();
      if (errorGetRewards) {
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
