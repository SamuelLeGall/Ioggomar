import { useQuestsStore } from "../../database-stores/quests";
import {
  AppError,
  AppErrorCodes,
  Result,
} from "../../models/BasicAndTempModels";
import {
  OnGoingQuest,
  OnGoingQuests,
  questDifficulty,
  QuestItem,
  Quests,
  QuestState,
} from "../../models/quests/QuestsModels";

export class QuestsRepository {
  private store;

  constructor(store = useQuestsStore()) {
    this.store = store;
  }

  /** Getters **/
  getOnGoingQuests(): OnGoingQuests {
    return this.store.onGoingQuests;
  }

  getCompletedQuestsKeys(): string[] {
    return this.store.completedQuests;
  }

  getAllQuests(): Quests {
    return this.store.listQuests;
  }

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

    this.store.onGoingQuests.splice(selectedQuestIndex, 1);
    return [true, null];
  }

  initNewOnGoingQuestById(
    questId: string,
    questDifficulty: questDifficulty
  ): Result<OnGoingQuest> {
    // check if the quest exist
    const [quest, errorAllQuest] = this.getQuestById(questId);
    if (errorAllQuest) {
      return [null, errorAllQuest];
    }

    const questConfig = quest.configs.find(
      (config) => config.difficulty === questDifficulty
    );
    if (!questConfig) {
      questConfig;
    }
  }

  addOnGoingQuestById(questId: string): Result<true> {
    // check if the quest exist
    const [quest, errorAllQuest] = this.getQuestById(questId);
    if (errorAllQuest) {
      return [null, errorAllQuest];
    }

    // check if quest is that the quest is not already ongoing
    const [onGoingQuest, errorOngoingQuest] = this.getOnGoingQuestById(questId);
    if (onGoingQuest) {
      return [
        null,
        new AppError(
          `Quest with id ${questId} already ongoing`,
          AppErrorCodes.ACTION_NOT_ALLOWED_DATA_CONSISTENCY
        ),
      ];
    }

    // unexpected error
    if (
      errorOngoingQuest.code !==
      AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
    ) {
      return [null, errorOngoingQuest];
    }

    this.store.onGoingQuests.push(quest);
    return [true, null];
  }

  addCompletedQuestById(questId: string): Result<true> {
    // Example logic for adding a completed quest
    if (!this.getCompletedQuestsKeys().includes(questId)) {
      return [
        null,
        new AppError(
          `Quest with id ${questId} already completed`,
          AppErrorCodes.ACTION_NOT_ALLOWED_DATA_CONSISTENCY
        ),
      ];
    }

    this.store.completedQuests.push(questId);
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
    this.store.onGoingQuests = data.onGoingQuests;
    this.store.completedQuests = data.completedQuests;
    this.store.listQuests = data.listQuests;
  }
}
