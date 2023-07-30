export enum Elements {
  FIRE = "fire",
  WATER = "water",
  WOOD = "wood",
  LIGHT = "light",
  DARK = "dark",
  NULL = "null",
}

export interface ElementalTypeCritricalConfig {
  success?: {
    optionnalStatusEffects: string[];
  };
  failure?: {
    optionnalStatusEffects: string[];
  };
}

export interface ElementalTypeConfig {
  damageMultiplier: number;
  criticalConfig?: ElementalTypeCritricalConfig;
}
export interface ElementalTypesInteractions {
  effectOn: {
    // if the defense element is not defined in the list of the mail elemet, we will take the default key
    DEFAULT: ElementalTypeConfig;
    [Elements.FIRE]?: ElementalTypeConfig;
    [Elements.WATER]?: ElementalTypeConfig;
    [Elements.WOOD]?: ElementalTypeConfig;
    [Elements.LIGHT]?: ElementalTypeConfig;
    [Elements.DARK]?: ElementalTypeConfig;
    [Elements.NULL]?: ElementalTypeConfig;
  };
}
export interface ElementalTypesGlobalConfig {
  // if the atk element is not defined in the config, we will take the default key from elementTypesConfig
  // or the null ElementalTypesInteractions depending on the needs
  [Elements.FIRE]: ElementalTypesInteractions;
  [Elements.WATER]: ElementalTypesInteractions;
  [Elements.WOOD]: ElementalTypesInteractions;
  [Elements.LIGHT]: ElementalTypesInteractions;
  [Elements.DARK]: ElementalTypesInteractions;
  [Elements.NULL]: ElementalTypesInteractions;
}
