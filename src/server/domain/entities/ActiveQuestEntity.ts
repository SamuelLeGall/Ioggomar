import {
  ActiveQuest,
  questDifficulty,
  QuestItemProgression,
} from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export class ActiveQuestEntity {
  private readonly quest: ActiveQuest;

  private constructor(quest: ActiveQuest) {
    this.quest = quest;
  }

  // For recreating from raw/persisted data
  public static fromData(data: ActiveQuest): ActiveQuestEntity {
    return new ActiveQuestEntity(data);
  }

  // For creating a new active quest from static quest + difficulty
  public static fromStaticQuest(
    quest: StaticQuestEntity,
    difficulty: questDifficulty,
  ): Result<ActiveQuestEntity> {
    try {
      quest.setDifficulty(difficulty);
      const resultGetGoals = quest.getQuestCompletionGoals();
      if (ResultFactory.isError(resultGetGoals)) {
        const [, errorGetGoals] = resultGetGoals;
        return [
          null,
          ErrorFactory.chainError(
            errorGetGoals,
            ErrorFactory.createContext("Entity", "fromStaticQuest", {
              questId: quest.getQuestId(),
              difficulty: difficulty,
            }),
          ),
        ];
      }
      const [questGoals] = resultGetGoals;
      const questData: ActiveQuest = {
        id: crypto.randomUUID(),
        staticQuestId: quest.getQuestId(),
        difficultyChosen: difficulty,
        data: [],
      };

      if (Array.isArray(questGoals) && questGoals.length > 0) {
        questData.data = questGoals.map((goal) => ({
          idItem: goal.idItem,
          targetAmount: goal.targetAmount,
          currentQuantity: 0,
        }));
      }

      const result = new ActiveQuestEntity(questData);

      return [result, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "fromStaticQuest", {
            questId: quest.getQuestId(),
            difficulty: difficulty,
          }),
          e,
        ),
      ];
    }
  }

  public getId() {
    return this.quest.id;
  }
  public getStaticQuestId() {
    return this.quest.staticQuestId;
  }
  public getDifficultyChosen() {
    return this.quest.difficultyChosen;
  }

  public canBeCompleted(): boolean {
    let result = true;
    this.quest.data.forEach((quest) => {
      if (quest.currentQuantity < quest.targetAmount) {
        result = false;
      }
    });
    return result;
  }

  public getProgress(): QuestItemProgression[] {
    return this.quest.data;
  }

  public getItemProgressionById(idItem: string): Result<QuestItemProgression> {
    const questProgress = this.getProgress();
    const selectedItemProgession = questProgress.find(
      (el) => el.idItem === idItem,
    );

    if (!selectedItemProgession) {
      return [
        null,
        ErrorFactory.questItemProgressionNotFound(
          this.getId(),
          this.getStaticQuestId(),
          idItem,
        ),
      ];
    }

    return [selectedItemProgession, null];
  }

  public incrementTarget(idItem: string, amount = 1): Result<boolean> {
    try {
      const resultGetItemProgress = this.getItemProgressionById(idItem);
      if (ResultFactory.isError(resultGetItemProgress)) {
        const [, errorGetItemProgress] = resultGetItemProgress;
        return [
          null,
          ErrorFactory.chainError(
            errorGetItemProgress,
            ErrorFactory.createContext("Entity", "incrementTarget", {
              idItem: idItem,
              amountToAdd: amount,
            }),
          ),
        ];
      }

      const [selectedIdItemProgression] = resultGetItemProgress;
      selectedIdItemProgression.currentQuantity += amount;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "incrementTarget", {
            questId: this.getId(),
            itemId: idItem,
          }),
          e,
        ),
      ];
    }
  }
}
