import { QuestDifficulty } from "@src/models/quests/quest.enums";

export interface QuestGoalItemRequirements {
  player?: {
    playerClass?: number;
    minLevel?: number;
    maxLevel?: number;
    maxLuck?: number;
  };
  game?: {
    minDay?: number;
    maxDay?: number;
    weather?: string;
    timeOfDay?: string;
  };
}

export interface QuestRewards {
  xp: number;
  gold: number;
  items?: string[];
}

export interface QuestPenalties {
  xpReset: boolean;
  equipmentDropped: boolean;
  levelsLost?: number;
}

export interface QuestGoalSubConfig {
  idItem: string;
  targetAmount: number;
  requirements?: QuestGoalItemRequirements;
}

export interface QuestGoalConfig {
  difficulty: QuestDifficulty;
  rewards: QuestRewards;
  penalties?: QuestPenalties;
  goals: QuestGoalSubConfig[];
}
