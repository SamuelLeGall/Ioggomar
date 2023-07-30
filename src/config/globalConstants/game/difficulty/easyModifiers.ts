import { DifficultyModifiers } from "@models/game/difficulties/difficultiesModels";

const easyDifficultyModifiers: DifficultyModifiers = {
  playerMultipliers: {
    atkMultiplier: 1.2,
    defMultiplier: 1.3,
  },
  friendliesMultipliers: {
    atkMultiplier: 1.2,
    defMultiplier: 1.7,
  },
  ennemiesMultipliers: {
    atkMultiplier: 0.7,
    defMultiplier: 0.8,
  },
};

export default easyDifficultyModifiers;
