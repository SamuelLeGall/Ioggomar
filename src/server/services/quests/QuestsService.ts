import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import { questDifficulty, QuestState } from "@src/models/quests/QuestsModels";
import { QuestsRepository } from "@src/server/repositories/Quests/QuestsRepository";
import { OnGoingQuestEntity } from "@src/server/Entity/OnGoingQuestEntity";

export class QuestService {
  private readonly repository: QuestsRepository;

  constructor(repository = new QuestsRepository()) {
    this.repository = repository;
  }

  /** Business Logic - It represent use cases or actions that the player can perform **/
  public acceptQuest(
    questId: string,
    difficulty: questDifficulty
  ): Result<true> {
    // Create a new active quest
    const instanceNewQuest = new OnGoingQuestEntity(
      questId,
      difficulty,
      this.repository
    );

    // Add the new quest into the list
    const [isQuestAdded, error] = this.repository.addOnGoingQuest(
      instanceNewQuest.toModel()
    );
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

    // we check that the quest is not already completed
    if (!this.repository.getCompletedQuestsKeys().includes(questId)) {
      return [
        null,
        new AppError(
          `Quest with id ${questId} already completed`,
          AppErrorCodes.ACTION_NOT_ALLOWED_DATA_CONSISTENCY
        ),
      ];
    }
    const [isQuestAddedToCompleted, errorAddId] =
      this.repository.addCompletedQuest(questId);

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
