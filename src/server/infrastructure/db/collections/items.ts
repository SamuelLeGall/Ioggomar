import { Items } from "@src/server/models/inventory/inventory.db.model";
import keyImg from "@src/public/components/UI/modules/inventory/pngtree-golden-key-metal-on-transparent-background-png-image_15629147.png";
import { ItemRarity } from "@src/server/models/inventory/inventory.enums";

export const itemsCollection: Items = [
  {
    id: "item_key_001",
    name: "Items.keys.item_key_001.name",
    description: "Items.keys.item_key_001.description",
    image: keyImg,
    price: 1_000,
    rarity: ItemRarity.COMMON,
    tags: ["Items.tags.category.trinket", "Items.tags.quantity"],
    hints: {
      source: [
        "Items.hints.item_hint_mid_boss",
        "Items.hints.item_hint_main_boss",
      ],
    },
    stackSize: 10,
  },
  {
    id: "item_key_002",
    name: "Items.keys.item_key_002.name",
    description: "Items.keys.item_key_002.description",
    image: keyImg,
    price: 10_000,
    rarity: ItemRarity.UNCOMMON,
    tags: ["Items.tags.category.trinket", "Items.tags.quantity"],
    hints: {
      source: [
        "Items.hints.item_hint_mid_boss",
        "Items.hints.item_hint_main_boss",
      ],
    },
    stackSize: 1,
  },
  {
    id: "item_key_003",
    name: "Items.keys.item_key_003.name",
    description: "Items.keys.item_key_003.description",
    image: keyImg,
    price: 25_000,
    rarity: ItemRarity.RARE,
    tags: ["Items.tags.category.trinket", "Items.tags.quantity"],
    hints: {
      source: [
        "Items.hints.item_hint_mid_boss",
        "Items.hints.item_hint_main_boss",
      ],
    },
    stackSize: 1,
  },
  {
    id: "item_key_004",
    name: "Items.keys.item_key_004.name",
    description: "Items.keys.item_key_004.description",
    image: keyImg,
    price: 75_000,
    rarity: ItemRarity.EPIC,
    tags: ["Items.tags.category.trinket", "Items.tags.quantity"],
    hints: {
      source: [
        "Items.hints.item_hint_mid_boss",
        "Items.hints.item_hint_main_boss",
      ],
    },
    stackSize: 1,
  },
  {
    id: "item_key_005",
    name: "Items.keys.item_key_005.name",
    description: "Items.keys.item_key_005.description",
    image: keyImg,
    price: 250_000,
    rarity: ItemRarity.LEGENDARY,
    tags: ["Items.tags.category.trinket", "Items.tags.quantity"],
    hints: {
      source: [
        "Items.hints.item_hint_mid_boss",
        "Items.hints.item_hint_main_boss",
      ],
    },
    stackSize: 1,
  },
];
