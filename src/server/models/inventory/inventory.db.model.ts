import { ItemRarity } from "@src/server/models/inventory/inventory.enums";

export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  rarity: ItemRarity;
  tags: string[];
  hints: {
    use?: string[];
    source: string[];
  };
  stackSize: number;
}
export type Items = Item[];

export interface ActiveItem {
  id: string;
  itemId: Item["id"];
  quantity: number;
}

export interface Inventory {
  id: string;
  data: ActiveItem[];
}
export type Inventories = Inventory[];
