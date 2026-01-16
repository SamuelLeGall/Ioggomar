import { QuestGoalConfig } from "./quest.shared.model";
import { QuestDifficulty, QuestType } from "./quest.enums";

export interface QuestItem {
  id: string;
  locationId: string;
  name: string;
  description: string;
  illustration: string;
  typeQuest: QuestType[];
  configs: QuestGoalConfig[];
}
export type Quests = QuestItem[];

export interface QuestItemProgression {
  idItem: string;
  currentQuantity: number;
  targetAmount: number;
}

export interface ActiveQuest {
  id: string;
  staticQuestId: string;
  difficultyChosen: QuestDifficulty;
  data: QuestItemProgression[];
}
export type ActiveQuests = ActiveQuest[];

export interface QuestState {
  activeQuests: ActiveQuests;
  completedQuests: string[];
  listQuests: Quests;
}
