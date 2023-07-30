import {
  ElementalTypeConfig,
  ElementalTypesGlobalConfig,
  ElementalTypesInteractions,
  Elements,
} from "@models/fight/ElementalTypesModels";
import { waterElementalTypeConfig } from "./waterElementalType";
import { woodElementalTypeConfig } from "./woodElementalType";
import { lightElementalTypeConfig } from "./lightElementalType";
import { darkElementalTypeConfig } from "./darkElementalType";
import { nullElementalTypeConfig } from "./nullElementalType";
import { fireElementalTypeConfig } from "./fireElementalType";

export const defaultElementalTypeConfig: ElementalTypeConfig = {
  damageMultiplier: 1,
};

export const elementalTypesGlobalConfig: ElementalTypesGlobalConfig = {
  [Elements.FIRE]: fireElementalTypeConfig,
  [Elements.WATER]: waterElementalTypeConfig,
  [Elements.WOOD]: woodElementalTypeConfig,
  [Elements.LIGHT]: lightElementalTypeConfig,
  [Elements.DARK]: darkElementalTypeConfig,
  [Elements.NULL]: nullElementalTypeConfig,
};
