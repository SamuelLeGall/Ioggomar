import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { ElementalTypes } from "@src/models/fight/ElementalTypesModels";
import {
  drawingResult,
  ErrorFactory,
  Result,
} from "@src/models/BasicAndTempModels";
import {
  convertPercentSuccessIntoSuccessMinNumber,
  isSuccess,
} from "@utils/DrawsUtils";

export class CombatantEntity {
  private combatant: Combatant;
  private timerBeforeNextAction: number;
  private currentHealth: number;

  private constructor(data: Combatant) {
    this.combatant = data;
    this.timerBeforeNextAction = this.getSpeed();
    this.currentHealth = this.getMaxHealth();
  }

  // For recreating from raw/persisted data
  public static fromData(data: Combatant): CombatantEntity {
    return new CombatantEntity(data);
  }

  getId = (): string => {
    return this.combatant.id;
  };

  getType = (): "PLAYER" | "ALLY" | "ENNEMY" => {
    return this.combatant.type;
  };

  getName = (): string => {
    return this.combatant.name;
  };

  getLevel = (): number => {
    return this.combatant.level ?? 1;
  };

  getElementalType(): ElementalTypes {
    return this.combatant.element;
  }

  getBaseStats() {
    return this.combatant.baseStats;
  }

  getXp() {
    return this.combatant.exp;
  }

  getEquipments() {
    return this.combatant.equipementSlots;
  }

  getHealth = (): number => {
    return this.currentHealth;
  };

  getMaxHealth = (): number => {
    const baseHealthPoints = this.combatant.baseStats.hp;
    const level = this.getLevel();
    return baseHealthPoints * level;
  };

  getMana = (): number => {
    const baseMana = this.combatant.baseStats.mana;
    const level = this.getLevel();
    return baseMana * level;
  };

  getMaxMana = (): number => {
    const baseMana = this.combatant.baseStats.mana;
    const level = this.getLevel();
    return baseMana * level;
  };

  getAttack = (): number => {
    const baseAttack = this.combatant.baseStats.atk;
    const level = this.getLevel();
    return baseAttack * level;
  };

  getMagicAttack = (): number => {
    const baseMagicAttack = this.combatant.baseStats.mAtk;
    const level = this.getLevel();
    return baseMagicAttack * level;
  };

  getDefense = (): number => {
    const baseDefense = this.combatant.baseStats.def;
    const level = this.getLevel();
    return baseDefense * level;
  };

  getMagicDefense = (): number => {
    const baseMagicDefense = this.combatant.baseStats.mDef;
    const level = this.getLevel();
    return baseMagicDefense * level;
  };

  getAgility = (): number => {
    const baseAgility = this.combatant.baseStats.agility;
    const level = this.getLevel();
    return baseAgility * level;
  };

  getDexterity = (): number => {
    const baseDexterity = this.combatant.baseStats.dexterity;
    const level = this.getLevel();
    return baseDexterity * level;
  };

  getSpeed = (): number => {
    const baseSpeed = this.combatant.baseStats.speed;
    const level = this.getLevel();
    return baseSpeed * level;
  };

  getLuck = (): number => {
    const baseLuck = this.combatant.baseStats.luck;
    const level = this.getLevel();
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

  updateTimeBeforeNextAction = (
    timeElapsedFromLastUpdate: number,
  ): Result<boolean> => {
    try {
      this.timerBeforeNextAction -= timeElapsedFromLastUpdate;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "updateTimeBeforeNextAction", {
            id: this.getId,
            timeElapsedFromLastUpdate,
          }),
          e,
        ),
      ];
    }
  };

  resetTimeBeforeNextAction = (): void => {
    this.timerBeforeNextAction = this.getSpeed();
  };

  calculateDamageReceived(attacker: CombatantEntity): Result<number> {
    try {
      const damages = attacker.getAttack() - this.getDefense();
      return [damages, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "calculateDamageReceived", {
            attackerId: attacker.getId(),
            defenderId: this.getId(),
            attackerAttack: attacker.getAttack(),
            defenderDefense: this.getDefense(),
          }),
          e,
        ),
      ];
    }
  }

  updateHealth(amount: number): Result<boolean> {
    try {
      this.currentHealth -= amount;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "updateHealth", {
            healthToRemove: amount,
            currentHealth: this.getHealth(),
          }),
          e,
        ),
      ];
    }
  }

  isLuckyHit = (): Result<boolean> => {
    try {
      // TODO : NO magic numbers
      const maxLuckyHitRate = 30;
      let luckyHitRate = Math.round((this.getBaseStats().luck + 5) / 100);
      if (luckyHitRate > maxLuckyHitRate) {
        luckyHitRate = maxLuckyHitRate;
      }
      const res: drawingResult = isSuccess(
        convertPercentSuccessIntoSuccessMinNumber(luckyHitRate),
      );
      return [res === drawingResult.SUCCESS, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "isLuckyHit", {
            id: this.getId(),
            luck: this.getBaseStats().luck,
          }),
          e,
        ),
      ];
    }
  };
}
