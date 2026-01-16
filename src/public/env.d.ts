/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ElectronAPI {
  saveGame: (data: unknown) => Promise<boolean>;
  loadGame: () => Promise<unknown>;
}

interface Window extends Window {
  electronAPI: ElectronAPI;
}
