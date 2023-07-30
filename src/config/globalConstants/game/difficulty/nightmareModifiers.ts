import { DifficultyModifiers } from "@models/game/difficulties/difficultiesModels";

const nightmareDifficultyModifiers: DifficultyModifiers = {
  playerMultipliers: {
    atkMultiplier: 0.5,
    defMultiplier: 0.8,
  },
  friendliesMultipliers: {
    atkMultiplier: 0.5,
    defMultiplier: 0.7,
  },
  ennemiesMultipliers: {
    atkMultiplier: 1.9,
    defMultiplier: 1.8,
  },
};

export default nightmareDifficultyModifiers;
