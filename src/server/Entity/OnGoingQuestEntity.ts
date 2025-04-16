import { OnGoingQuest, questDifficulty } from "@src/models/quests/QuestsModels";
import { QuestsRepository } from "@src/server/repositories/Quests/QuestsRepository";
import { QuestInstanceRepository } from "@src/server/repositories/Quests/QuestInstanceRepository";

export class OnGoingQuestEntity {
  private readonly quest:OnGoingQuest;

  constructor(questId: string, difficulty:questDifficulty,instanceQuestsRepo: QuestsRepository) {
    const [quest, errorGetQuest] = instanceQuestsRepo.getQuestById(questId);
    if (!quest) {
      throw errorGetQuest;
    }
    const instanceQuest = new QuestInstanceRepository(
      questId,
      instanceQuestsRepo
    );
    instanceQuest.setDifficulty(difficulty);
    const [questGoals, errorGetGoals] =
      instanceQuest.getQuestCompletionGoals();
    if (!Array.isArray(questGoals) || questGoals.length === 0) {
      throw errorGetGoals;
    }
    this.quest = {
      id: instanceQuest.getQuestId(),
      data: questGoals.map((goal) => {
        return {
          idItem: goal.idItem,
          targetAmount: goal.targetAmount,
          currentQuantity: 0,
        };
      }),
    };
  }
  public getId() {
    return this.quest.id;
  }

  public getProgress() {
    return this.quest.data;
  }

  // CAREFUL here it may be KO because of the way we communicate with the BDD
  public incrementTarget(itemId: string, amount = 1) {
    const target = this.quest.data.find((g) => g.idItem === itemId);
    if (target) {
      target.targetAmount += amount;
    }
  }

  public toModel(): OnGoingQuest {
    return this.quest;
  }
}