import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ActiveQuestUI,
  QuestItemUI,
} from "@src/models/quests/quest.frontend.model";

export const useQuestStore = defineStore("quest", () => {
  const activeQuests = ref<ActiveQuestUI[]>([]);
  const completedQuests = ref<string[]>([]);
  const listQuests = ref<QuestItemUI[]>([]);

  return {
    listQuests,
    activeQuests,
    completedQuests,
  };
});
