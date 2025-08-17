import { SettingsService } from "@src/server/application/settings.service";
import { OptionConfig, ResultFactory } from "@src/models/BasicAndTempModels";
import { useToast } from "vue-toast-notification";

export class SettingsApiService {
  private backendService: SettingsService;
  private toast;

  constructor(backendService = new SettingsService()) {
    // This class may seem redundant for now, but it’s here to enforce a clean separation between
    // the frontend API interface and "backend" logic. In the future, it can easily be replaced
    // with real API calls without needing to refactor the entire codebase.
    this.backendService = backendService;
    this.toast = useToast({
      position: "top-right",
      duration: 1500,
    });
  }

  /** GETTERS */
  getCurrentLocalization = (): OptionConfig | undefined => {
    const result = this.backendService.getCurrentLocalization();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [currentLocalization] = result;
    return currentLocalization;
  };

  getCurrentTheme = (): OptionConfig | undefined => {
    const result = this.backendService.getCurrentTheme();
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return;
    }
    const [currentTheme] = result;
    return currentTheme;
  };

  /** MUTATIONS */
  changeLocalization = (newLocalization: OptionConfig): boolean => {
    const result = this.backendService.changeLocalization(newLocalization);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    return true;
  };

  changeTheme = (newTheme: OptionConfig): boolean => {
    const result = this.backendService.changeTheme(newTheme);
    if (ResultFactory.isErrorFrontend(result)) {
      const [, message] = result;
      this.toast.error(message);
      return false;
    }
    return true;
  };
}
