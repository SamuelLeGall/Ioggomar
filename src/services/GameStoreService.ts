export class GameStoreService {
  // private store;
  // private locale;
  // private libelles;
  //
  // constructor(store = useGameStore()) {
  //   const { t, locale } = useI18n({ useScope: "global" });
  //   this.store = store;
  //   this.locale = locale;
  //   this.libelles = t;
  // }
  // /** Getters **/
  // getLocalizationText(): string {
  //   return this.store.currentLocalization.value;
  // }
  //
  // getLocalizationKey(): string {
  //   return this.store.currentLocalization.key;
  // }
  //
  // getLocalizationLibelle() {
  //   return this.libelles;
  // }
  //
  // getLocalization(): OptionConfig {
  //   return {
  //     key: this.getLocalizationKey(),
  //     value: this.getLocalizationText(),
  //   };
  // }
  //
  // getDataThemeText(): string {
  //   return this.store.currentDataTheme.value;
  // }
  //
  // getDataThemeKey(): string {
  //   return this.store.currentDataTheme.key;
  // }
  //
  // getDataTheme(): OptionConfig {
  //   return {
  //     key: this.getDataThemeKey(),
  //     value: this.getDataThemeText(),
  //   };
  // }
  //
  // /** Technical Actions - no actual high level user-action at this level **/
  // setCurrentLocalization(newLocalization: OptionConfig): void {
  //   this.store.currentLocalization = newLocalization;
  //   this.locale.value = newLocalization.key;
  // }
  //
  // setCurrentDataTheme(newDataTheme: OptionConfig): void {
  //   this.store.currentDataTheme = newDataTheme;
  // }
  //
  // getGameStoreState(): MainSettings {
  //   return {
  //     currentLocalization: this.getLocalization(),
  //     currentDataTheme: this.getDataTheme(),
  //   };
  // }
  // setGameStoreState(data: MainSettings): void {
  //   this.setCurrentLocalization(data.currentLocalization);
  //   this.setCurrentDataTheme(data.currentDataTheme);
  // }
}
