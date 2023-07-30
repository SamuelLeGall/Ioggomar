export enum Difficulties {
  VERY_EASY = "veryEasy",
  EASY = "easy",
  NORMAL = "normal",
  HARD = "hard",
  NIGHTMARE = "nightmare",
}

export interface EntitiesMultiplier {
  atkMultiplier: number;
  defMultiplier: number;
}

export interface DifficultyModifiers {
  playerMultipliers: EntitiesMultiplier;
  friendliesMultipliers: EntitiesMultiplier;
  ennemiesMultipliers: EntitiesMultiplier;
}

export interface DifficultiesModifiers {
  [Difficulties.VERY_EASY]: DifficultyModifiers;
  [Difficulties.EASY]: DifficultyModifiers;
  [Difficulties.NORMAL]: DifficultyModifiers;
  [Difficulties.HARD]: DifficultyModifiers;
  [Difficulties.NIGHTMARE]: DifficultyModifiers;
}
