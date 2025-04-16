import {
  ElementalTypeConfig,
  ElementalTypesGlobalConfig,
  ElementalTypes,
} from "@src/models/fight/ElementalTypesModels";
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
  [ElementalTypes.FIRE]: fireElementalTypeConfig,
  [ElementalTypes.WATER]: waterElementalTypeConfig,
  [ElementalTypes.WOOD]: woodElementalTypeConfig,
  [ElementalTypes.LIGHT]: lightElementalTypeConfig,
  [ElementalTypes.DARK]: darkElementalTypeConfig,
  [ElementalTypes.NULL]: nullElementalTypeConfig,
};
