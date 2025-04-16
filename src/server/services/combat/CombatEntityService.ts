import { drawingResult } from "@src/models/BasicAndTempModels";
import { ElementalTypes } from "@src/models/fight/ElementalTypesModels";
import { CombatantInstanceRepository } from "@src/server/repositories/Combatants/CombatantInstanceRepository";
import {
  isSuccess,
  convertPercentSuccessIntoSuccessMinNumber,
} from "@utils/DrawsUtils";
import { CombatantsRepository } from "@src/server/repositories/Combatants/CombatantsRepository";

export class CombatEntityService {
  private repository: CombatantInstanceRepository;
  private timerBeforeNextAction: number;
  private currentHealth: number;

  constructor(combatantId: string) {
    this.repository = new CombatantInstanceRepository(combatantId,new CombatantsRepository());
    this.timerBeforeNextAction = this.getSpeed();
    this.currentHealth = this.getMaxHealth();
  }

  getName = (): string => {
    return this.repository.getName();
  };

  getLevel = (): number => {
    return this.repository.getLevel();
  };

  getElementalType(): ElementalTypes {
    return this.repository.getElementalType();
  }

  getHealth = (): number => {
    return this.currentHealth;
  };

  getMaxHealth = (): number => {
    const baseHealthPoints = this.repository.getBaseMaxHealthValue();
    const level = this.repository.getLevel();
    return baseHealthPoints * level;
  };

  getMana = (): number => {
    const baseMana = this.repository.getBaseMaxManaValue();
    const level = this.repository.getLevel();
    return baseMana * level;
  };

  getMaxMana = (): number => {
    const baseMana = this.repository.getBaseMaxManaValue();
    const level = this.repository.getLevel();
    return baseMana * level;
  };

  getAttack = (): number => {
    const baseAttack = this.repository.getBaseAttackValue();
    const level = this.repository.getLevel();
    return baseAttack * level;
  };

  getMagicAttack = (): number => {
    const baseMagicAttack = this.repository.getBaseMagicAttackValue();
    const level = this.repository.getLevel();
    return baseMagicAttack * level;
  };

  getDefense = (): number => {
    const baseDefense = this.repository.getBaseDefenseValue();
    const level = this.repository.getLevel();
    return baseDefense * level;
  };

  getMagicDefense = (): number => {
    const baseMagicDefense = this.repository.getBaseMagicDefenseValue();
    const level = this.repository.getLevel();
    return baseMagicDefense * level;
  };

  getAgility = (): number => {
    const baseAgility = this.repository.getBaseAgilityValue();
    const level = this.repository.getLevel();
    return baseAgility * level;
  };

  getDexterity = (): number => {
    const baseDexterity = this.repository.getBaseDexterityValue();
    const level = this.repository.getLevel();
    return baseDexterity * level;
  };

  getSpeed = (): number => {
    const baseSpeed = this.repository.getBaseSpeedValue();
    const level = this.repository.getLevel();
    return baseSpeed * level;
  };

  getLuck = (): number => {
    const baseLuck = this.repository.getBaseLuckValue();
    const level = this.repository.getLevel();
    return baseLuck * level;
  };

  isAlive = (): boolean => {
    const health = this.getHealth();
    return health > 0;
  };

  // methods only use the instance CombatEntities stats and not stats from another CombatEntities
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

  getTimeBeforeNextAction = (): number => {
    return this.timerBeforeNextAction;
  };

  updateTimeBeforeNextAction = (timeElapsedFromLastUpdate: number): void => {
    this.timerBeforeNextAction -= timeElapsedFromLastUpdate;
  };

  resetTimeBeforeNextAction = (): void => {
    this.timerBeforeNextAction = this.getSpeed();
  };

  calculateDamageReceived(attacker: CombatEntityService): number {
    return attacker.getAttack() - this.getDefense();
  }

  updateHealth(amount: number): void {
    this.currentHealth -= amount;
  }

  isLuckyHit = (): boolean => {
    const maxLuckyHitRate = 30;
    let luckyHitRate = Math.round(
      (this.repository.getBaseLuckValue() + 5) / 100
    );
    if (luckyHitRate > maxLuckyHitRate) {
      luckyHitRate = maxLuckyHitRate;
    }
    const res: drawingResult = isSuccess(
      convertPercentSuccessIntoSuccessMinNumber(luckyHitRate)
    );
    return res === drawingResult.SUCCESS;
  };
}
