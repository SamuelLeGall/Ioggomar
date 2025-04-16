import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import {
  OnGoingQuest,
  OnGoingQuests,
  questDifficulty,
  QuestItem,
  Quests,
  QuestState,
} from "@src/models/quests/QuestsModels";
import { questsCollection } from "@src/server/database/quests";

export class QuestsRepository {
  //  A repository's getters should be solid. It's mutation should be dumb, the safety should be done at the service layer.
  // here if we update a quest by id all check if it exist in this context were already done
  // Mutation should only do exactly what they say without causing a fatal error, nothing more nothing less
  private database;

  constructor(database = questsCollection) {
    this.database = database;
  }

  /** Getters **/
  getOnGoingQuests(): OnGoingQuests {
    return this.database.onGoingQuests;
  }

  getCompletedQuestsKeys(): string[] {
    return this.database.completedQuests;
  }

  getAllQuests(): Quests {
    return this.database.listQuests;
  }

  /**
   * Fetch a single quest from the list. Use only for scoping.
   * Any logic related to a single quest MUST go into QuestInstanceRepository.
   */
  getQuestById(questId: string): Result<QuestItem> {
    const listQuests = this.getAllQuests();
    const selectedQuest = listQuests.find((quest: QuestItem) => {
      return quest.id === questId;
    });
    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND
        ),
      ];
    }

    return [selectedQuest, null];
  }

  /**
   * Fetch a single ongoing quest from the list.
   * This is NOT a quests object of QuestInstanceRepository
   */
  getOnGoingQuestById(questId: string): Result<OnGoingQuest> {
    const listQuests = this.getOnGoingQuests();
    const selectedQuest = listQuests.find((quest: OnGoingQuest) => {
      return quest.id === questId;
    });

    if (!selectedQuest) {
      return [
        null,
        new AppError(
          `No ongoing quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    return [selectedQuest, null];
  }

  /**
   * Fetch the index associated to a single quest from the list.
   * This is NOT a quests object of QuestInstanceRepository
   */
  getOnGoingQuestIndexById(questId: string): Result<number> {
    const listQuests = this.getOnGoingQuests();
    const selectedQuestIndex = listQuests.findIndex((quest: OnGoingQuest) => {
      return quest.id === questId;
    });

    if (selectedQuestIndex === -1) {
      return [
        null,
        new AppError(
          `No ongoing quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    return [selectedQuestIndex, null];
  }

  /** Technical Actions - no actual high level user-action at this level **/

  /** Mutations/Setter **/
  removeOnGoingQuestById(questId: string): Result<true> {
    const [selectedQuestIndex, error] = this.getOnGoingQuestIndexById(questId);

    if (error) {
      return [
        null,
        new AppError(
          `No ongoing quest found for id ${questId}`,
          AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
        ),
      ];
    }

    this.database.onGoingQuests.splice(selectedQuestIndex, 1);
    return [true, null];
  }

  addOnGoingQuest(newQuest:OnGoingQuest): Result<true> {
    this.database.onGoingQuests.push(newQuest);
    return [true, null];
  }

  addCompletedQuest(questId: string): Result<true> {
    this.database.completedQuests.push(questId);
    return [true, null];
  }

  getQuestsStoreState(): QuestState {
    return {
      onGoingQuests: this.getOnGoingQuests(),
      completedQuests: this.getCompletedQuestsKeys(),
      listQuests: this.getAllQuests(),
    };
  }

  setQuestsStoreState(data: QuestState) {
    this.database.onGoingQuests = data.onGoingQuests;
    this.database.completedQuests = data.completedQuests;
    this.database.listQuests = data.listQuests;
  }
}
