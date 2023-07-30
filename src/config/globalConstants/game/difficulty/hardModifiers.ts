import { DifficultyModifiers } from "@models/game/difficulties/difficultiesModels";

const hardDifficultyModifiers: DifficultyModifiers = {
  playerMultipliers: {
    atkMultiplier: 0.8,
    defMultiplier: 0.7,
  },
  friendliesMultipliers: {
    atkMultiplier: 0.8,
    defMultiplier: 0.7,
  },
  ennemiesMultipliers: {
    atkMultiplier: 1.1,
    defMultiplier: 1.2,
  },
};

export default hardDifficultyModifiers;
