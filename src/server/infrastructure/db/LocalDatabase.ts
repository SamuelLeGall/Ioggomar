import { questsCollection } from "@src/server/infrastructure/db/collections/quests";
import { playerCollection } from "@src/server/infrastructure/db/collections/defaultValues/player.default";
import { gameCollection } from "@src/server/infrastructure/db/collections/defaultValues/game.default";
import { combatantsCollection } from "@src/server/infrastructure/db/collections/combatants";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import { Document } from "@src/server/infrastructure/db/Document";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import {
  ActiveQuest,
  ActiveQuests,
  QuestItem,
  Quests,
} from "@src/models/quests/quest.db.model";
import { Player } from "@src/models/player/player.db.models";
import { MainSettings } from "@src/models/game/settings.db.models";

export type GameDatabase = {
  readonly: {
    quests: Quests;
    combatants: Combatant[];
  };
  session: {
    activeQuests: ActiveQuests;
    player: Player;
    gameSettings: MainSettings;
  };
};

export class LocalDatabase {
  private STORAGE_KEY = "local_db";

  /**
   * We need to load the localStorage for all calls to be sure to not have a stale db that is not up to date.
   */
  private load(): Result<GameDatabase> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [this.getDefault(), null];

      const parsed = JSON.parse(raw);
      return [parsed, null];
    } catch (e) {
      // If localStorage is corrupted, return default but log the error
      console.warn("LocalStorage corrupted, using default database:", e);
      return [this.getDefault(), null];
    }
  }

  private save(db: GameDatabase): Result<boolean> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("LocalDatabase", "save", {}),
          e,
        ),
      ];
    }
  }

  // Repositories
  readonly combatants = new Collection<Combatant>(
    () => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        // Fallback to default on load error
        return this.getDefault().readonly.combatants;
      }
      const [db] = loadResult;
      return db.readonly.combatants;
    },
    (_, options) => {
      if (!options?.force) {
        throw new Error("Readonly data cannot be updated");
      }

      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        throw new Error("Cannot reset: Database load failed");
      }

      const [db] = loadResult;
      db.readonly.combatants = this.getDefault().readonly.combatants;

      const saveResult = this.save(db);
      if (ResultFactory.isError(saveResult)) {
        throw new Error("Cannot reset: Database save failed");
      }
    },
    () => this.getDefault().readonly.combatants,
    "Combatant",
  );

  readonly quests = new Collection<QuestItem>(
    () => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        return this.getDefault().readonly.quests;
      }
      const [db] = loadResult;
      return db.readonly.quests;
    },
    (_, options) => {
      if (!options?.force) {
        throw new Error("Readonly data cannot be updated");
      }

      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        throw new Error("Cannot reset: Database load failed");
      }

      const [db] = loadResult;
      db.readonly.quests = this.getDefault().readonly.quests;

      const saveResult = this.save(db);
      if (ResultFactory.isError(saveResult)) {
        throw new Error("Cannot reset: Database save failed");
      }
    },
    () => this.getDefault().readonly.quests,
    "QuestItem",
  );

  readonly activeQuests = new Collection<ActiveQuest>(
    () => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        return this.getDefault().session.activeQuests;
      }
      const [db] = loadResult;
      return db.session.activeQuests;
    },
    (data, options) => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        throw new Error("Cannot update: Database load failed");
      }
      const [db] = loadResult;
      db.session.activeQuests = options?.force
        ? this.getDefault().session.activeQuests
        : data;

      const saveResult = this.save(db);
      if (ResultFactory.isError(saveResult)) {
        throw new Error("Cannot update: Database save failed");
      }
    },
    () => this.getDefault().session.activeQuests,
    "ActiveQuest",
  );

  readonly player = new Document<Player>(
    () => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        return this.getDefault().session.player;
      }
      const [db] = loadResult;
      return db.session.player;
    },
    (data, options) => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        throw new Error("Cannot reset: Database load failed");
      }
      const [db] = loadResult;
      db.session.player = options?.force
        ? this.getDefault().session.player
        : data;

      const saveResult = this.save(db);
      if (ResultFactory.isError(saveResult)) {
        throw new Error("Cannot update: Database save failed");
      }
    },
    () => this.getDefault().session.player,
    "PlayerI",
  );

  readonly gameSettings = new Document<MainSettings>(
    () => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        return this.getDefault().session.gameSettings;
      }
      const [db] = loadResult;
      return db.session.gameSettings;
    },
    (data, options) => {
      const loadResult = this.load();
      if (ResultFactory.isError(loadResult)) {
        throw new Error("Cannot reset: Database load failed");
      }
      const [db] = loadResult;

      db.session.gameSettings = options?.force
        ? this.getDefault().session.gameSettings
        : data;

      const saveResult = this.save(db);
      if (ResultFactory.isError(saveResult)) {
        throw new Error("Cannot update: Database save failed");
      }
    },
    () => this.getDefault().session.gameSettings,
    "MainSettings",
  );

  private getDefault(): GameDatabase {
    return {
      readonly: {
        quests: questsCollection,
        combatants: combatantsCollection,
      },
      session: {
        activeQuests: [],
        player: playerCollection, // single document
        gameSettings: gameCollection, // single document
      },
    };
  }

  /** DO NOT use this method except for save/load */
  public _DumpDB(): Result<GameDatabase> {
    return this.load();
  }
  /** DO NOT use this method except for save/load */
  public _RestoreDB(data: GameDatabase): Result<boolean> {
    return this.save(data);
  }
}
