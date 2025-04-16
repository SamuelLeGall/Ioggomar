export enum questType {
  LOOT = "LOOT",
  COMBAT = "COMBAT",
}
export enum questDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  PAIN = 4, // to allow to filter by ASC difficulty if needed
}
// Interface for an individual ongoing quest
export interface QuestItemProgression {
  idItem: string;
  currentQuantity: number;
  targetAmount: number;
}


// Interface for the ongoing quests data structure
export interface OnGoingQuest {
  id: string;
  data: QuestItemProgression[];
}
export type OnGoingQuests = OnGoingQuest[];

/** to use mostly for bonus/more difficults objectives */
export interface questGoalItemRequirements {
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
export interface questRewards {
  xp: number;
  gold: number;
  items?: string[];
}
export interface questPenalities {
  xpReset: boolean;
  equipementDropped: boolean; // if true, on defeat, roll a break/drop chance on all items equiped
  levelsLost?: number;
}
export interface QuestGoalSubConfig {
    idItem: string;
    targetAmount: number;
    requirements?: questGoalItemRequirements;
}
export interface QuestGoalConfig {
  difficulty: questDifficulty;
  rewards: questRewards;
  penalities?: questPenalities;
  goals: QuestGoalSubConfig[]; // This contains the possible goals for each config
}

// Interface for a single quest in the list
export interface QuestItem {
  id: string;
  locationId: string;
  name: string;
  description: string;
  typeQuest: questType;
  configs: QuestGoalConfig[];
}
export type Quests = QuestItem[];

// Interface for the overall quest state
export interface QuestState {
  onGoingQuests: OnGoingQuests;
  completedQuests: string[]; // Array of quest IDs
  listQuests: Quests;
}
