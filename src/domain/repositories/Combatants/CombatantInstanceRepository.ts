import { Combatant } from "../../models/entitiesStats/CombatantModels";
import { ElementalTypes } from "../../models/fight/ElementalTypesModels";
import { CombatantsRepository } from "./CombatantsRepository";

export class CombatantInstanceRepository {
  private combatant: Combatant;

  constructor(combatantId: string, instanceCombatants: CombatantsRepository) {
    const [data, error] = instanceCombatants.getCombatantById(combatantId);

    if (!data) {
      throw error;
    }

    this.combatant = data;
  }

  /** Getters **/

  getName(): string {
    return this.combatant.name;
  }

  getLevel() {
    return this.combatant.level;
  }

  getElementalType(): ElementalTypes {
    return this.combatant.element;
  }

  getBaseMaxHealthValue(): number {
    return this.combatant.baseStats.hp;
  }

  getBaseMaxManaValue(): number {
    return this.combatant.baseStats.hp;
  }

  getBaseAttackValue(): number {
    return this.combatant.baseStats.atk;
  }

  getBaseMagicAttackValue(): number {
    return this.combatant.baseStats.mAtk;
  }

  getBaseDefenseValue(): number {
    return this.combatant.baseStats.def;
  }

  getBaseMagicDefenseValue(): number {
    return this.combatant.baseStats.mDef;
  }

  getBaseAgilityValue(): number {
    return this.combatant.baseStats.agility;
  }

  getBaseDexterityValue(): number {
    return this.combatant.baseStats.dexterity;
  }

  getBaseSpeedValue(): number {
    return this.combatant.baseStats.speed;
  }

  getBaseLuckValue(): number {
    return this.combatant.baseStats.luck;
  }

  /** Technical Actions - no actual high level user-action at this level **/
  // player stats, equiped equipement/items are not taken into account here

  getCombatantStoreState() {
    return this.combatant;
  }
}
