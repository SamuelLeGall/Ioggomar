import { MainSettings } from "@src/models/game/settings.db.models";

/** Default state - it is readonly **/
export const gameCollection: MainSettings = {
  currentLocalization: {
    key: "fr-FR",
    value: "Français",
  },
  currentDataTheme: {
    key: "primary",
    value: "primary",
  },
};
