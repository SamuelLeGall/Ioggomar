import { QuestService } from "@src/server/application/quests/quest.service";
import {
  ActiveQuestForFrontend,
  questDifficulty,
  QuestItemForFrontend,
  QuestItemProgressionUpdateRequest,
} from "@src/models/quests/QuestsModels";

export class QuestApiService {
  private backendService: QuestService;

  constructor(backendService = new QuestService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
  }

  /** GETTERS */

  getAllQuests(): QuestItemForFrontend[] | undefined {
    const [quests] = this.backendService.getAllQuests();
    if (!quests) {
      return;
    }
    return quests;
  }
  getQuestById(questId: string): QuestItemForFrontend | undefined {
    const [quest] = this.backendService.getQuestById(questId);
    if (!quest) {
      return;
    }
    return quest;
  }
  getAllActiveQuests(): ActiveQuestForFrontend[] | undefined {
    const [quests] = this.backendService.getAllActiveQuests();
    if (!quests) {
      return;
    }
    return quests;
  }
  getActiveQuestById(questId: string): ActiveQuestForFrontend | undefined {
    const [quest] = this.backendService.getActiveQuestById(questId);
    if (!quest) {
      return;
    }
    return quest;
  }

  /** MUTATIONS */
  accept(questId: string, difficulty: questDifficulty): boolean {
    const [success] = this.backendService.acceptQuest(questId, difficulty);
    return Boolean(success);
  }

  cancel(questId: string): boolean {
    const [success] = this.backendService.cancelQuest(questId);
    return Boolean(success);
  }

  complete(questId: string): boolean {
    const [success] = this.backendService.completeQuest(questId);
    return Boolean(success);
  }

  incrementProgress(
    questId: string,
    progressUpdated: QuestItemProgressionUpdateRequest[],
  ): boolean {
    const [success] = this.backendService.incrementProgress(
      questId,
      progressUpdated,
    );
    return Boolean(success);
  }
}
