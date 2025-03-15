import { Result } from "@src/domain/models/BasicAndTempModels";
import { QuestState } from "@src/domain/models/quests/QuestsModels";
import { QuestsRepository } from "@src/domain/repositories/Quests/QuestsRepository";

export class QuestService {
  private repository: QuestsRepository;

  constructor(repository = new QuestsRepository()) {
    this.repository = repository;
  }

  /** Business Logic - It represent use cases or actions that the player can perform **/
  public acceptQuest(questId: string): Result<true> {
    const [isQuestAdded, error] = this.repository.addOnGoingQuestById(questId);
    if (!isQuestAdded) {
      return [null, error];
    }

    return [true, null];
  }

  public cancelQuest(questId: string): Result<true> {
    const [isQuestRemovedFromOnGoing, errorRemoveQuest] =
      this.repository.removeOnGoingQuestById(questId);

    if (!isQuestRemovedFromOnGoing) {
      return [null, errorRemoveQuest];
    }

    // Additional logic for canceling a quest can go here
    // e.g., updating other state, notifying the user, etc.

    return [true, null];
  }

  public completeQuest(questId: string): Result<true> {
    const [isQuestRemovedFromOnGoing, errorRemoveQuest] =
      this.repository.removeOnGoingQuestById(questId);

    if (!isQuestRemovedFromOnGoing) {
      return [null, errorRemoveQuest];
    }

    const [isQuestAddedToCompleted, errorAddId] =
      this.repository.addCompletedQuestById(questId);

    if (!isQuestAddedToCompleted) {
      return [null, errorAddId];
    }

    return [true, null];
  }

  public failQuest(questId: string): Result<true> {
    const [isQuestRemovedFromOnGoing, errorRemoveQuest] =
      this.repository.removeOnGoingQuestById(questId);

    if (!isQuestRemovedFromOnGoing) {
      return [null, errorRemoveQuest];
    }

    // eventual processing because quest failed
    return [true, null];
  }

  public initializeQuestsState(data: QuestState) {
    return this.repository.setQuestsStoreState(data);
  }

  public exportQuestsState(): QuestState {
    return this.repository.getQuestsStoreState();
  }
}
