import { QuestItemProgression } from "./quest.db.model";
import { QuestRewards, QuestPenalties } from "./quest.shared.model";
import { QuestDifficulty } from "@src/models/quests/quest.enums";

export interface ActiveQuestUI {
  id: string;
  staticQuestId: string;
  difficultyChosen: QuestDifficulty;
  canComplete: boolean;
  data: QuestItemProgression[];
}

export interface QuestItemUI {
  id: string;
  name: string;
  description: string;
  illustration: string;
  difficulty: QuestDifficulty;
  availableDifficulties: QuestItemDifficultyOutcomesUI[];
}

export interface QuestItemDifficultyOutcomesUI {
  difficulty: QuestDifficulty;
  rewards: QuestRewards;
  penalties?: QuestPenalties;
}

export interface QuestItemProgressionUpdateRequest {
  idItem: string;
  quantityToAdd: number;
}
