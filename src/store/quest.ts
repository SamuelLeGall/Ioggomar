import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "../models/quests/QuestsModels";

export const useQuestStore = defineStore("quest", () => {
  const activeQuests = ref<ActiveQuestForFrontend[]>([]);
  const completedQuests = ref<string[]>([]);
  const listQuests = ref<QuestItemForFrontend[]>([]);

  return {
    listQuests,
    activeQuests,
    completedQuests,
  };
});
