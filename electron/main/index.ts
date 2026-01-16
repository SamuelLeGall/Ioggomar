import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  IpcMainEvent,
} from "electron";
import { release } from "os";
import { join } from "path";
import * as fs from "fs";

const dir = app.getPath("documents") + "\\My Games\\Ioggomar";
const options = {
  title: "Save file",
  defaultPath: `${dir}\\saves\\currentSave.json`,
  filters: [{ name: "json", extensions: ["json"] }],
};

async function save(_event: IpcMainEvent, saveData: any): Promise<boolean> {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(`${dir}\\saves`);
    }
    const { canceled, filePath } = await dialog.showSaveDialog(options);
    if (canceled) {
      console.error(`[save] Error : dialog cancelled`);
      return false;
    }
    const writer = fs.createWriteStream(filePath);
    writer.write(JSON.stringify(saveData), "utf-8");
    return true;
  } catch (err) {
    console.error(`[save] Error : ${err}`);
    return false;
  }
}

async function load(): Promise<any> {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      fs.mkdirSync(`${dir}\\saves`);
    }
    const { canceled, filePaths } = await dialog.showOpenDialog(options);
    if (canceled) {
      console.error(`[load] Error : dialog cancelled`);
      return;
    }

    const readStream = fs.createReadStream(filePaths[0], "utf8");
    let data = "";
    for await (const chunk of readStream) {
      data += chunk;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error(`[load] Error : ${err}`);
    return;
  }
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, "../.."),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL as string;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(ROOT_PATH.public, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:saveGame", save);
  ipcMain.handle("dialog:loadGame", load);
  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
