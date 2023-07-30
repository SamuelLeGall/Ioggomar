import { drawingResult } from "@models/game/basic";
import {
  convertPercentSuccessIntoSuccessMinNumber,
  isSuccess,
} from "@utils/DrawsUtils";
import {
  ElementalTypeConfig,
  ElementalTypesInteractions,
  Elements,
} from "@models/fight/ElementalTypesModels";
import {
  defaultElementalTypeConfig,
  elementalTypesGlobalConfig,
} from "@config/globalConstants/fighting/Elements/elementTypesConfig";

function getElementalTypeConfig(
  atkElement: Elements,
  defElement: Elements
): ElementalTypeConfig {
  // if the attacker element is not in the global config --> we return a default config that will not give any bonus/malus
  if (!elementalTypesGlobalConfig[atkElement]) {
    return defaultElementalTypeConfig;
  }
  const atkTypeConfig: ElementalTypesInteractions =
    elementalTypesGlobalConfig[atkElement]!;

  // if the defender element is not in the attacker config --> we return a default config that will not give any bonus/malus
  return atkTypeConfig.effectOn[defElement] || defaultElementalTypeConfig;
}

// Note: max luckyHitRate is fixed at 30% chance. (coresponding to successMinNumber = 70)
//calc tel que max pour 180 luck | max-10% pour 150
// 2.5sqrt(X)  ----  recursiveCalc()
// S = 250,
// A = 200,
// B = 175,
// C = 125,
// D = 90,
// E = 75,
// F = 50,
// const recursiveCalc = (result, currentStatValue) => {
//   // result += 1.85*Math.sqrt(currentStatValue);
//   result += Math.round(currentStatValue/50);
//   if(currentStatValue === 0) {
//     return Math.round(result/10);
//   }
//   currentStatValue--;
//   return recursiveCalc(result,currentStatValue);
// };

// const res = [10,50,75,100,125,150,180];
// for(i =0;i < res.length; i++) {
//   console.log(recursiveCalc(25,res[i]));
// }

export const isLuckyHit = (attackerLuck: number): boolean => {
  const maxLuckyHitRate = 30;
  let luckyHitRate = Math.round((attackerLuck + 5) / 100);
  if (luckyHitRate > maxLuckyHitRate) {
    luckyHitRate = maxLuckyHitRate;
  }
  const res: drawingResult = isSuccess(
    convertPercentSuccessIntoSuccessMinNumber(luckyHitRate)
  );
  return res === drawingResult.SUCCESS;
};
export const isCriticalHit = (attackerStats, defenderStats): boolean => {
  return false;
};

// speed - agility - dexterity - luck
// high agility increase dodge rate
// high dexterity increase crit rate and hit rate
export const checkDodgeSuccesfull = (attackerStats, defenderStats): boolean => {
  return true;
};