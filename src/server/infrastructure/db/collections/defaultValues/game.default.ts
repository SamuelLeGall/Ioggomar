import { OptionConfig } from "@src/models/BasicAndTempModels";

export interface gameCollectionModel {
  currentLocalization: OptionConfig;
  currentDataTheme: OptionConfig;
}
/** Default state - it is readonly **/
export const gameCollection: gameCollectionModel = {
  currentLocalization: {
    key: "fr_FR",
    value: "Français",
  },
  currentDataTheme: {
    key: "primary",
    value: "primary",
  },
};
