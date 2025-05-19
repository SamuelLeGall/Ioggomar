import { MainSettings } from "@src/models/game/SettingsModels";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import {Document} from "@src/server/infrastructure/db/Document";
import { GameSettingsEntity } from "@src/server/domain/entities/GameSettingsEntity";

export class GameRepository {
  private database: Document<MainSettings>;

  constructor(database = new LocalDatabase()) {
    this.database = database.gameSettings;
  }

  /** Private Getters */
  private toDB(entity: GameSettingsEntity): MainSettings {
    return {
      currentLocalization: entity.getLocalization(),
      currentDataTheme: entity.getDataTheme()
    };
  }

  private toEntity(data: MainSettings): GameSettingsEntity {
    return GameSettingsEntity.fromData(data);
  }

  /** Getters **/
  public get():GameSettingsEntity{
    return this.toEntity(this.database.get());
  }

  public update(entity:GameSettingsEntity):void{
    this.database.update(()=>{
      return this.toDB(entity)
    })
  }

  /** Technical Actions - no actual high level user-action at this level **/
  // getGameStoreState(): MainSettings {
  //   return {
  //     currentLocalization: this.getLocalization(),
  //     currentDataTheme: this.getDataTheme(),
  //   };
  // }
  //
  // setGameStoreState(data: MainSettings): void {
  //   this.setCurrentLocalization(data.currentLocalization);
  //   this.setCurrentDataTheme(data.currentDataTheme);
  // }
}
