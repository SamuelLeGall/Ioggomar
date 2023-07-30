import {
  ElementalTypesInteractions,
  Elements,
} from "@models/fight/ElementalTypesModels";
import { defaultElementalTypeConfig } from "./elementTypesConfig";

export const waterElementalTypeConfig: ElementalTypesInteractions = {
  effectOn: {
    DEFAULT: defaultElementalTypeConfig,
    [Elements.FIRE]: {
      damageMultiplier: 0.5,
    },
    [Elements.WATER]: {
      damageMultiplier: 0.25,
      criticalConfig: {
        failure: {
          optionnalStatusEffects: [],
        },
      },
    },
    [Elements.WOOD]: {
      damageMultiplier: 1.75,
      criticalConfig: {
        success: {
          optionnalStatusEffects: [],
        },
      },
    },
  },
};
