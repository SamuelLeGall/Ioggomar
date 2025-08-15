import { PlayerI } from "@src/models/player/PlayerModels";
import { ErrorFactory, Result } from "@src/models/BasicAndTempModels";

export class PlayerEntity {
  private readonly player: PlayerI;

  private constructor(player: PlayerI) {
    this.player = player;
  }

  // For recreating from raw/persisted data
  public static fromData(data: PlayerI): PlayerEntity {
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
