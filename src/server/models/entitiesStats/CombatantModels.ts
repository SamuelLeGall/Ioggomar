import { ElementalTypes } from "../fight/ElementalTypesModels";

// base stats used when calculating the stat of player with his level.
//only updated with some specific items/events
interface CombatantStats {
  hp: number;
  mana: number;
  atk: number;
  mAtk: number;
  def: number;
  mDef: number;
  agility: number; // high agility increase dodge rate
  dexterity: number; // high dexterity increase crit rate and hit rate
  speed: number;
  luck: number;
}

interface CombatantsEquipmentSlots {
  head: null | string; //with string the id of the item
  torso: null | string;
  pants: null | string;
  shoes: null | string;
  accessory: null | string;
}

export interface Combatant {
  id: string;
  type: "PLAYER" | "ALLY" | "ENNEMY";
  name: string;
  element: ElementalTypes;
  baseStats: CombatantStats;
  level: number;
  exp: number;
  equipementSlots: CombatantsEquipmentSlots;
}
