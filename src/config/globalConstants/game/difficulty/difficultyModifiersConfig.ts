import {
  Difficulties,
  DifficultiesModifiers,
} from "@src/models/game/difficulties/DifficultiesModifiersModels";
import veryEasyDifficultyModifiers from "./veryEasyModifiers";
import easyDifficultyModifiers from "./easyModifiers";
import normalDifficultyModifiers from "./normalModifiers";
import hardDifficultyModifiers from "./hardModifiers";
import nightmareDifficultyModifiers from "./nightmareModifiers";

export const difficultyModifiersConfig: DifficultiesModifiers = {
  [Difficulties.VERY_EASY]: veryEasyDifficultyModifiers,
  [Difficulties.EASY]: easyDifficultyModifiers,
  [Difficulties.NORMAL]: normalDifficultyModifiers,
  [Difficulties.HARD]: hardDifficultyModifiers,
  [Difficulties.NIGHTMARE]: nightmareDifficultyModifiers,
};
