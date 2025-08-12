import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n, VueMessageType } from "vue-i18n";
import App from "./App.vue";
import router from "@router/index";
import type { LocaleMessages } from "vue-i18n";
import { createCustomMessageObject } from "@src/localizations";

// All global CSS files
import "@styles/index.scss";

(async () => {
  const localizationMessagesObject = await createCustomMessageObject();
  const messages = {
    // localizationMessagesObject.[YOUR_PARAMETER] : YOUR_PARAMETER  must be the wanted folder name on @/localization/[your_folder_name]
    // you must also add your new localization into config/mapping.json --> in game.localization   --> value should be equal to YOUR_PARAMETER
    "fr-FR": localizationMessagesObject[
      "fr-FR"
    ] as LocaleMessages<VueMessageType>,
    "en-US": localizationMessagesObject[
      "en-US"
    ] as LocaleMessages<VueMessageType>,
  };
  const i18n = createI18n({
    legacy: false,
    locale: "fr-FR", // set locale
    fallbackLocale: "en-US", // set fallback locale
    messages, // set locale messages
  });
  const pinia = createPinia();

  const app = createApp(App);
  app.use(i18n);
  app.use(router);
  app.use(pinia);
  app.mount("#app");
})();
