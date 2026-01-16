import { Item } from "@src/models/inventory/inventory.db.model";
import { ItemRarity } from "@src/models/inventory/inventory.enums";

export class ItemEntity {
  private readonly item: Item;
  private constructor(item: Item) {
    this.item = item;
  }

  // For recreating from raw/persisted data
  public static fromData(data: Item): ItemEntity {
    return new ItemEntity(data);
  }

  public getId() {
    return this.item.id;
  }
  public getName() {
    return this.item.name;
  }
  public getDescription() {
    return this.item.description;
  }
  public getImage() {
    return this.item.image;
  }
  public getPrice() {
    return this.item.price;
  }
  public getRarity(): ItemRarity {
    return this.item.rarity;
  }
  public getTags() {
    return this.item.tags;
  }
  public getUseHints(): undefined | string[] {
    return this.item.hints.use;
  }
  public getSourceHints(): string[] {
    return this.item.hints.source;
  }
  public getHints() {
    return {
      ...this.getUseHints(),
      ...this.getSourceHints(),
    };
  }
  public getStackSize() {
    return this.item.stackSize;
  }
}
