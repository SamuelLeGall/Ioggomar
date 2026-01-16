import { ItemRarity } from "@src/models/inventory/inventory.enums";
import { ItemTag } from "@src/models/inventory/inventory.shared.model";

export interface InventoryUI {
  id: string;
  data: InventoryItemUI[];
}

export interface InventoryItemUI {
  id: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  rarity: ItemRarity;
  tracking: {
    isTracked: boolean;
    isRecyclabledIntoTracked: boolean;
  };
  tags: ItemTag[];
  hints: {
    use?: string[];
    source: string[];
  };
  stackSize: number;
}

export interface DragPayload {
  fromInventoryId: string;
  itemId: string;
}
