import { QuestService } from "@src/server/application/quests/quest.service";
import {
  ActiveQuestForFrontend,
  questDifficulty,
  QuestItemForFrontend,
  QuestItemProgressionUpdateRequest,
} from "@src/models/quests/QuestsModels";
import { useToast } from "vue-toast-notification";
import { ResultFactory } from "@src/models/BasicAndTempModels";

export class QuestApiService {
  private backendService: QuestService;
  private toast;

  constructor(backendService = new QuestService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
    this.toast = useToast({
      position: "top-right",
      duration: 1500,
    });
  }

  /** GETTERS */

  getAllQuests = (): QuestItemForFrontend[] | undefined => {
    const result = this.backendService.getAllQuests();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [quests] = result;
    return quests;
  };
  getQuestById = (questId: string): QuestItemForFrontend | undefined => {
    const result = this.backendService.getQuestById(questId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [quest] = result;
    return quest;
  };
  getAllActiveQuests = (): ActiveQuestForFrontend[] | undefined => {
    const result = this.backendService.getAllActiveQuests();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [quests] = result;
    return quests;
  };
  getActiveQuestById = (
    questId: string,
  ): ActiveQuestForFrontend | undefined => {
    const result = this.backendService.getActiveQuestById(questId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [quest] = result;
    return quest;
  };

  /** MUTATIONS */
  accept = (questId: string, difficulty: questDifficulty): boolean => {
    const result = this.backendService.acceptQuest(questId, difficulty);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;

    return Boolean(success);
  };

  cancel = (questId: string): boolean => {
    const result = this.backendService.cancelQuest(questId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;
    return Boolean(success);
  };

  complete = (questId: string): boolean => {
    const result = this.backendService.completeQuest(questId);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;
    return Boolean(success);
  };

  incrementProgress = (
    questId: string,
    progressUpdated: QuestItemProgressionUpdateRequest[],
  ): boolean => {
    const result = this.backendService.incrementProgress(
      questId,
      progressUpdated,
    );
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    const [success] = result;
    return Boolean(success);
  };
}
