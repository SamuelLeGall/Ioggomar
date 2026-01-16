import { ErrorFactory, Result } from "@src/server/models/BasicAndTempModels";
import { Player } from "@src/server/models/player/player.db.models";

export class PlayerEntity {
  private readonly player: Player;

  private constructor(player: Player) {
    this.player = player;
  }

  // For recreating from raw/persisted data
  public static fromData(data: Player): PlayerEntity {
    return new PlayerEntity(data);
  }

  public getLevel(): number {
    return this.player.playerLevel;
  }

  public levelUp(nbLevelsToAdd = 1): Result<boolean> {
    try {
      this.player.playerLevel += nbLevelsToAdd;
      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Entity", "fromStaticQuest", {
            nbLevelsToAdd: nbLevelsToAdd,
          }),
          e,
        ),
      ];
    }
  }

  public engageDiscussion() {
    // TODO (ceci est une fonction example)
  }
}
