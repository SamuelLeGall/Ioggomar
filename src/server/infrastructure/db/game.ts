import { OptionConfig } from "@src/models/BasicAndTempModels";

interface gameCollectionModel {
  currentLocalization: OptionConfig;
  currentDataTheme: OptionConfig;
}
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
