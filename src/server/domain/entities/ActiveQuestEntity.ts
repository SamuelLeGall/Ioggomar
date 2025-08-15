import { ActiveQuest, questDifficulty } from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import { ErrorFactory, Result } from "@src/models/BasicAndTempModels";

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
      const [questGoals, errorGetGoals] = quest.getQuestCompletionGoals();
      if (errorGetGoals) {
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
      if (!Array.isArray(questGoals) || questGoals.length === 0) {
        throw errorGetGoals;
      }

      const questData: ActiveQuest = {
        id: crypto.randomUUID(),
        staticQuestId: quest.getQuestId(),
        difficultyChosen: difficulty,
        data: questGoals.map((goal) => ({
          idItem: goal.idItem,
          targetAmount: goal.targetAmount,
          currentQuantity: 0,
        })),
      };

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

  public getProgress() {
    return this.quest.data;
  }

  public incrementTarget(itemId: string, amount = 1): Result<boolean> {
    try {
      this.getProgress();
      const target = this.quest.data.find((g) => g.idItem === itemId);
      if (!target) {
        // ErrorFactory.

        // TODO
        return [true, null];
      }

      target.currentQuantity += amount;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "incrementTarget", {
            questId: this.getId(),
            itemId: itemId,
          }),
          e,
        ),
      ];
    }
  }
}
