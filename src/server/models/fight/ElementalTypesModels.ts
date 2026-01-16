export enum ElementalTypes {
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
    [ElementalTypes.FIRE]?: ElementalTypeConfig;
    [ElementalTypes.WATER]?: ElementalTypeConfig;
    [ElementalTypes.WOOD]?: ElementalTypeConfig;
    [ElementalTypes.LIGHT]?: ElementalTypeConfig;
    [ElementalTypes.DARK]?: ElementalTypeConfig;
    [ElementalTypes.NULL]?: ElementalTypeConfig;
  };
}
export interface ElementalTypesGlobalConfig {
  // if the atk element is not defined in the config, we will take the default key from elementTypesConfig
  // or the null ElementalTypesInteractions depending on the needs
  [ElementalTypes.FIRE]: ElementalTypesInteractions;
  [ElementalTypes.WATER]: ElementalTypesInteractions;
  [ElementalTypes.WOOD]: ElementalTypesInteractions;
  [ElementalTypes.LIGHT]: ElementalTypesInteractions;
  [ElementalTypes.DARK]: ElementalTypesInteractions;
  [ElementalTypes.NULL]: ElementalTypesInteractions;
}
