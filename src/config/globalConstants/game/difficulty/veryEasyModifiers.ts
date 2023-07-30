import { DifficultyModifiers } from "@models/game/difficulties/difficultiesModels";

const veryEasyDifficultyModifiers: DifficultyModifiers = {
  playerMultipliers: {
    atkMultiplier: 1.6,
    defMultiplier: 1.4,
  },
  friendliesMultipliers: {
    atkMultiplier: 1.3,
    defMultiplier: 1.9,
  },
  ennemiesMultipliers: {
    atkMultiplier: 0.5,
    defMultiplier: 0.6,
  },
};

export default veryEasyDifficultyModifiers;
