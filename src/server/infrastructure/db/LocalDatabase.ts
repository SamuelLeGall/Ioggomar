import { questsCollection } from "@src/server/infrastructure/db/collections/quests";
import { playerCollection } from "@src/server/infrastructure/db/collections/defaultValues/player.default";
import { gameCollection } from "@src/server/infrastructure/db/collections/defaultValues/game.default";
import { combatantsCollection } from "@src/server/infrastructure/db/collections/combatants";
import {
  ActiveQuest,
  ActiveQuests,
  QuestItem,
  Quests,
} from "@src/models/quests/QuestsModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import { Document } from "@src/server/infrastructure/db/Document";
import { PlayerI } from "@src/models/player/PlayerModels";
import { MainSettings } from "@src/models/game/SettingsModels";

export type GameDatabase = {
  readonly: {
    quests: Quests;
    combatants: Combatant[];
  };
  session: {
    activeQuests: ActiveQuests;
    player: PlayerI;
    gameSettings: MainSettings;
  };
};

export class LocalDatabase {
  private STORAGE_KEY = "local_db";

  /**
   * We need to load the localStorage for all calls to be sure to not have a stale db that is not up to date.
   */
  private load(): GameDatabase {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return this.getDefault();
    return JSON.parse(raw);
  }

  private save(db: GameDatabase) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(db));
  }

  // Repositories
  readonly combatants = new Collection<Combatant>(
    () => this.load().readonly.combatants,
    (_, options) => {
      if (options?.force) {
        const db = this.load();
        db.readonly.combatants = this.getDefault().readonly.combatants;
        this.save(db);
        return;
      }

      throw new Error("Readonly data cannot be updated");
    },
    () => this.getDefault().readonly.combatants,
  );
  readonly quests = new Collection<QuestItem>(
    () => this.load().readonly.quests,
    (_, options) => {
      if (options?.force) {
        const db = this.load();
        db.readonly.quests = this.getDefault().readonly.quests;
        this.save(db);
        return;
      }

      throw new Error("Readonly data cannot be updated");
    },
    () => this.getDefault().readonly.quests,
  );
  readonly activeQuests = new Collection<ActiveQuest>(
    () => this.load().session.activeQuests,
    (data, options) => {
      if (options?.force) {
        const db = this.load();
        db.session.activeQuests = this.getDefault().session.activeQuests;
        this.save(db);
        return;
      }

      const db = this.load();
      db.session.activeQuests = data;
      this.save(db);
    },
    () => this.getDefault().session.activeQuests,
  );

  readonly player = new Document<PlayerI>(
    () => this.load().session.player,
    (data, options) => {
      if (options?.force) {
        const db = this.load();
        db.session.player = this.getDefault().session.player;
        this.save(db);
        return;
      }

      const db = this.load();
      db.session.player = data;
      this.save(db);
    },
    () => this.getDefault().session.player,
  );

  readonly gameSettings = new Document<MainSettings>(
    () => this.load().session.gameSettings,
    (data, options) => {
      if (options?.force) {
        const db = this.load();
        db.session.gameSettings = this.getDefault().session.gameSettings;
        this.save(db);
        return;
      }

      const db = this.load();
      db.session.gameSettings = data;
      this.save(db);
    },
    () => this.getDefault().session.gameSettings,
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
  public _DumpDB(): GameDatabase {
    return this.load();
  }
  /** DO NOT use this method except for save/load */
  public _RestoreDB(data: GameDatabase): void {
    this.save(data);
  }
}
