import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import { QuestItem } from "@src/server/models/quests/quest.db.model";
import {
  QuestDifficulty,
  QuestType,
} from "@src/server/models/quests/quest.enums";
import {
  QuestGoalConfig,
  QuestGoalSubConfig,
  QuestPenalties,
  QuestRewards,
} from "@src/server/models/quests/quest.shared.model";

export class StaticQuestEntity {
  private quest: QuestItem;
  private difficulty: QuestDifficulty;
  constructor(quest: QuestItem) {
    this.quest = quest;
    const availableDifficulties = this.getQuestAvailableDifficulties();
    this.difficulty =
      availableDifficulties.find((el) => el === QuestDifficulty.MEDIUM) ??
      availableDifficulties[0];
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

  public getQuestType(): QuestType[] {
    return this.quest.typeQuest;
  }

  public getQuestAvailableDifficulties(): QuestDifficulty[] {
    return this.getQuestConfigurations().map((el) => el.difficulty);
  }

  public getQuestDifficulty(): QuestDifficulty {
    return this.difficulty;
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
      const difficulty = this.getQuestDifficulty();
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

  public haveQuestPenalties(): Result<boolean> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "haveQuestPenalties", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      return [Boolean(configuration.penalties), null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "haveQuestPenalties", {
            questId: this.getQuestId(),
          }),
          e,
        ),
      ];
    }
  }

  public getQuestRewards(): Result<QuestRewards> {
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

  public getQuestPenalties(): Result<QuestPenalties | null> {
    try {
      const resultGetConfig = this.getQuestConfiguration();
      if (ResultFactory.isError(resultGetConfig)) {
        const [, errorGetConfig] = resultGetConfig;
        return [
          null,
          ErrorFactory.chainError(
            errorGetConfig,
            ErrorFactory.createContext("Entity", "getQuestPenalties", {
              questId: this.getQuestId(),
            }),
          ),
        ];
      }
      const [configuration] = resultGetConfig;

      if (!configuration.penalties) {
        // there may not be any penality for some quests, so not an error.
        return [null, null];
      }

      return [configuration.penalties, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "getQuestPenalties", {
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
  public setDifficulty(difficulty: QuestDifficulty) {
    this.difficulty = difficulty;
  }
}
