import { defineStore } from "pinia";
import { ref } from "vue";
import {
  OnGoingQuests,
  questDifficulty,
  Quests,
  questType,
} from "../models/quests/QuestsModels";

// Use QuestRepository to manipulate the data
export const useQuestsStore = defineStore("quests", () => {
  const onGoingQuests = ref<OnGoingQuests>([]);

  // player can complete some quests multiple times.
  const completedQuests = ref<string[]>(["loc1_quest001"]);
  const listQuests = ref<Quests>([
    {
      id: "loc1_quest001",
      name: "Hello quest 1",
      description: "you must do stuff",
      locationId: "loc1_tuto",
      typeQuest: questType.LOOT,
      configs: [
        {
          difficulty: questDifficulty.EASY,
          rewards: {
            xp: 100,
            gold: 100,
          },
          goals: [
            { idItem: "loot_slime_001", targetAmount: 5 },
            { idItem: "loot_goblin_001", targetAmount: 3 },
            {
              idItem: "loot_metal_slime_001",
              targetAmount: 1,
              requirements: { player: { maxLuck: 3 } },
            },
          ],
        },
        {
          difficulty: questDifficulty.MEDIUM,
          rewards: {
            xp: 150,
            gold: 150,
          },
          goals: [
            { idItem: "loot_slime_001", targetAmount: 5 },
            { idItem: "loot_goblin_001", targetAmount: 5 },
            {
              idItem: "loot_metal_slime_001",
              targetAmount: 2,
              requirements: { player: { maxLuck: 5 } },
            },
            {
              idItem: "loot_golem_002", //rare loot of golem
              targetAmount: 2,
              requirements: { player: { minLevel: 10 } },
            },
          ],
        },
      ],
    },
    {
      id: "loc1_quest002",
      name: "Hello quest 2",
      description: "you must do stuff 2",
      locationId: "loc1_tavern",
      typeQuest: questType.LOOT,
      configs: [
        {
          difficulty: questDifficulty.MEDIUM,
          rewards: {
            xp: 150,
            gold: 150,
          },
          goals: [
            { idItem: "loot_slime_001", targetAmount: 5 },
            { idItem: "loot_goblin_001", targetAmount: 3 },
          ],
        },
      ],
    },
  ]);

  return {
    listQuests,
    onGoingQuests,
    completedQuests,
  };
});