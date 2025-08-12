import { ActiveQuest, questDifficulty } from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";

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
  ): ActiveQuestEntity {
    quest.setDifficulty(difficulty);
    const [questGoals, errorGetGoals] = quest.getQuestCompletionGoals();
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

    return new ActiveQuestEntity(questData);
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

  public incrementTarget(itemId: string, amount = 1) {
    const target = this.quest.data.find((g) => g.idItem === itemId);
    if (target) {
      target.currentQuantity += amount;
    }
  }
}
