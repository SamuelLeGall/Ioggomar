import { useGameStore } from "@src/store/game";
import { useI18n } from "vue-i18n";
import { OptionConfig } from "@src/models/BasicAndTempModels";
import { SettingsApiService } from "@src/services/game/SettingsApi.service";

export class SettingsStoreService {
  private store;
  private locale;
  private libelles;
  private api: SettingsApiService;

  constructor(store = useGameStore(), api = new SettingsApiService()) {
    const { t, locale } = useI18n({ useScope: "global" });
    this.store = store;
    this.locale = locale;
    this.libelles = t;
    this.api = api;
  }
  /** Getters **/
  getLabel = (key: string): string => {
    return this.libelles(key) ?? key;
  };
  getLocalizationText = (): string => {
    return this.store.currentLocalization.value;
  };

  getLocalizationKey = (): string => {
    return this.store.currentLocalization.key;
  };

  getLocalizationLibelle = () => {
    // At the moment that the only thing that will stay only in the "front" because of the use of i18n
    // i won't migrate it in the db level like the rest for now.
    return this.libelles;
  };

  getLocalization = (): OptionConfig => {
    return {
      key: this.getLocalizationKey(),
      value: this.getLocalizationText(),
    };
  };

  getDataThemeText = (): string => {
    return this.store.currentDataTheme.value;
  };

  getDataThemeKey = (): string => {
    return this.store.currentDataTheme.key;
  };

  getDataTheme = (): OptionConfig => {
    return {
      key: this.getDataThemeKey(),
      value: this.getDataThemeText(),
    };
  };

  /** Technical Actions - no actual high level user-action at this level **/
  syncLocalization = () => {
    const newLocalization = this.api.getCurrentLocalization();
    if (!newLocalization) {
      return;
    }
    this.store.currentLocalization = newLocalization;
    this.locale.value = newLocalization.key;
  };
  syncTheme = () => {
    const newDataTheme = this.api.getCurrentTheme();
    if (!newDataTheme) {
      return;
    }
    this.store.currentDataTheme = newDataTheme;
    document.documentElement.setAttribute("data-theme", newDataTheme.key);
  };
}
