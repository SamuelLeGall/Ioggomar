import { QuestApiService } from "@src/services/quests/QuestApi.service";
import { useQuestStore } from "@src/store/quest";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";

export class QuestStoreService {
  private store;
  private api: QuestApiService;

  constructor(store = useQuestStore(), api = new QuestApiService()) {
    this.store = store;
    this.api = api;
  }

  getAllQuests = (): QuestItemForFrontend[] => {
    return this.store.listQuests;
  };
  syncAllQuests = (): void => {
    const listUpdated = this.api.getAllQuests();
    if (!listUpdated) {
      return;
    }
    this.store.listQuests = listUpdated;
  };

  getAllActiveQuests = (): ActiveQuestForFrontend[] => {
    return this.store.activeQuests;
  };
  syncAllActiveQuests = (): void => {
    const listUpdated = this.api.getAllActiveQuests();
    if (!listUpdated) {
      return;
    }
    this.store.activeQuests = listUpdated;
  };

  getQuestById = (questId: string): QuestItemForFrontend | undefined => {
    return this.getAllQuests().find((el) => el.id === questId);
  };
  getQuestIndexById = (questId: string): number => {
    return this.getAllQuests().findIndex((el) => el.id === questId);
  };
  syncQuestById = (questId: string): void => {
    const questUpdated = this.api.getQuestById(questId);
    if (!questUpdated) {
      // quest not found in backend
      return;
    }

    const index = this.getQuestIndexById(questId);
    if (index === -1) {
      // quest not found in the store, we add it.
      this.store.listQuests.push(questUpdated);
      return;
    }

    // we update the existing quest in the store
    this.store.listQuests[index] = questUpdated;
  };

  getActiveQuestById = (
    questId: string,
  ): ActiveQuestForFrontend | undefined => {
    return this.getAllActiveQuests().find((el) => el.id === questId);
  };
  getActiveQuestIndexById = (questId: string): number => {
    return this.getAllActiveQuests().findIndex((el) => el.id === questId);
  };
  syncActiveQuestById = (questId: string): void => {
    const questUpdated = this.api.getActiveQuestById(questId);
    if (!questUpdated) {
      // quest not found in backend
      return;
    }

    const index = this.getActiveQuestIndexById(questId);
    if (index === -1) {
      // quest not found in the store, we add it.
      this.store.activeQuests.push(questUpdated);
      return;
    }

    // we update the existing quest in the store
    this.store.activeQuests[index] = questUpdated;
  };

  public refreshAllQuests = (): void => {
    console.log(this);
    this.syncAllQuests();
    this.syncAllActiveQuests();
  };
}
