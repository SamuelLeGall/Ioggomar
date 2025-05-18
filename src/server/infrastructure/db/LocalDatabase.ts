import { questsCollection } from "@src/server/infrastructure/db/collections/quests";
import { playerCollection } from "@src/server/infrastructure/db/collections/defaultValues/player.default";
import {
  gameCollection,
  gameCollectionModel,
} from "@src/server/infrastructure/db/collections/defaultValues/game.default";
import { combatantsCollection } from "@src/server/infrastructure/db/collections/combatants";
import {
  ActiveQuest,
  ActiveQuests,
  QuestItem,
  Quests,
} from "@src/models/quests/QuestsModels";
import { Combatant } from "@src/models/entitiesStats/CombatantModels";
import { Collection } from "@src/server/infrastructure/db/Collection";
import {Document} from "@src/server/infrastructure/db/Document";
import { PlayerI } from "@src/models/player/PlayerModels";

export type GameDatabase = {
  readonly: {
    quests: Quests;
    combatants: Combatant[];
  };
  session: {
    activeQuests: ActiveQuests;
    player: PlayerI;
    gameSettings: gameCollectionModel;
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
  readonly quests = new Collection<QuestItem>(
    () => this.load().readonly.quests,
    () => {
      throw new Error("Readonly data cannot be updated");
    }
  );
  readonly combatants = new Collection<Combatant>(
    () => this.load().readonly.combatants,
    () => {
      throw new Error("Readonly data cannot be updated");
    }
  );

  readonly activeQuests = new Collection<ActiveQuest>(
    () => this.load().session.activeQuests,
    (data) => {
      const db = this.load();
      db.session.activeQuests = data;
      this.save(db);
    }
  );

  readonly player = new Document<PlayerI>(
    () => this.load().session.player,
    (data) => {
      const db = this.load();
      db.session.player = data;
      this.save(db);
    }
  );

  readonly gameSettings = new Document<gameCollectionModel>(
    () => this.load().session.gameSettings,
    (data) => {
      const db = this.load();
      db.session.gameSettings = data;
      this.save(db);
    }
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
}
