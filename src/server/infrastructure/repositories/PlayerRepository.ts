import { Document } from "@src/server/infrastructure/db/Document";
import { LocalDatabase } from "@src/server/infrastructure/db/LocalDatabase";
import { PlayerEntity } from "@src/server/domain/entities/PlayerEntity";
import { PlayerI } from "@src/models/player/PlayerModels";

export class PlayerRepository {
  private database: Document<PlayerI>;

  constructor(database = new LocalDatabase()) {
    this.database = database.player;
  }

  /** Private Getters */
  private toDB(entity: PlayerEntity): PlayerI {
    return {
      playerLevel:entity.getLevel()
    };
  }

  private toEntity(data: PlayerI): PlayerEntity {
    return PlayerEntity.fromData(data);
  }

  public get():PlayerEntity{
    return this.toEntity(this.database.get());
  }

  public update(entity:PlayerEntity):void{
    this.database.update(()=>{
      return this.toDB(entity)
    })
  }
}
