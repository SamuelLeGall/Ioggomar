import {
  Quests,
  questDifficulty,
  questType
} from "@src/models/quests/QuestsModels";

export const questsCollection: Quests = [
    {
      id: "loc1_quest001",
      name: "Quests.loc1_quest001.name",
      description: "Quests.loc1_quest001.description",
      locationId: "loc1_tuto",
      illustration: "",
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
            { idItem: "loot_slime_001", targetAmount: 6 },
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
      name: "Quests.loc1_quest002.name",
      description: "Quests.loc1_quest002.description",
      locationId: "loc1_tavern",
      illustration: "",
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
  ]
