<template>
  <div
    :class="itemContainerClass"
    draggable="true"
    @dragstart="onDragStart($event)"
    @click="handleClick"
  >
    <div class="inventory-slot-item-img">
      <img :src="itemData.image" alt="item-img" draggable="false" />
    </div>
    <div class="inventory-slot-item-icons">
      <span v-for="tag in itemData.tags" :key="tag.id">
        <i v-if="tag.type === 'ICON'" :class="tag.icon">{{
          getLabel(tag.alt)
        }}</i>
        <template v-else>
          {{ getLabel(tag.text) }}
        </template>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { InventoryItemUI } from "@src/server/models/inventory/inventory.frontend.model";
import { computed, ref } from "vue";
import { ItemRarity } from "@src/server/models/inventory/inventory.enums";
import { SettingsStoreService } from "@src/public/services/game/SettingsStore.service";

const props = defineProps<{
  inventoryId: string;
  itemData: InventoryItemUI;
}>();
export interface IClickItemData {
  itemId: string;
  ctrlKeyPressed: boolean;
  shiftKeyPressed: boolean;
  altKeyPressed: boolean;
}
const emit = defineEmits<{
  (e: "click", data: IClickItemData): void;
}>();

// STATE
const isSelected = ref<boolean>(false);

// API

// STORE
const settingsStoreService = new SettingsStoreService();

// COMPUTED
const rarityBackgroundColor = computed<string>(() => {
  switch (props.itemData.rarity) {
    case ItemRarity.LEGENDARY:
      return "gold";
    case ItemRarity.EPIC:
      return "purple";
    case ItemRarity.RARE:
      return "blue";
    case ItemRarity.UNCOMMON:
      return "green";
    case ItemRarity.COMMON:
    default:
      return "white";
  }
});

const itemContainerClass = computed<string>(() => {
  return `inventory-slot inventory-slot-item ${rarityBackgroundColor.value} ${isSelected.value ? "selected" : ""}`;
});

// METHODS
const toggleSelection = () => {
  isSelected.value = !isSelected.value;
};

const getLabel = (key: string): string => {
  return settingsStoreService
    .getLabel(key)
    .replace("<QUANTITY>", props.itemData.quantity.toString());
};

const handleClick = (event: MouseEvent) => {
  if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
    // simple selection of the element for group actions with right click.
    // TODO add special border color etc
    toggleSelection();
    return;
  }

  emit("click", {
    itemId: props.itemData.id,
    ctrlKeyPressed: event.ctrlKey,
    shiftKeyPressed: event.shiftKey,
    altKeyPressed: event.altKey,
  });
};

const onDragStart = (event: DragEvent) => {
  if (!event.dataTransfer) return;

  const payload = {
    itemId: props.itemData.id,
    fromInventoryId: props.inventoryId,
  };
  const dragImage = (event.currentTarget as HTMLElement).cloneNode(
    true,
  ) as HTMLElement;
  dragImage.style.position = "absolute";
  dragImage.style.top = "-9999px";
  dragImage.style.pointerEvents = "none";
  dragImage.style.opacity = "0.9";
  document.body.appendChild(dragImage);

  event.dataTransfer.setData(props.inventoryId, "");
  event.dataTransfer.setData("application/json", JSON.stringify(payload));
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setDragImage(dragImage, 50, 50);

  setTimeout(() => document.body.removeChild(dragImage), 0);
};

// HOOKS
</script>

<style scoped>
.inventory-slot-item.white {
  background: linear-gradient(
    to bottom left,
    rgba(179, 179, 179, 0) 30%,
    rgba(179, 179, 179, 0.9) 100%
  );
}

.inventory-slot-item.green {
  background: linear-gradient(
    to bottom left,
    rgba(95, 213, 79, 0) 30%,
    rgba(95, 213, 79, 0.9) 100%
  );
}

.inventory-slot-item.blue {
  background: linear-gradient(
    to bottom left,
    rgba(79, 110, 213, 0) 30%,
    rgba(79, 110, 213, 0.9) 100%
  );
}

.inventory-slot-item.purple {
  background: linear-gradient(
    to bottom left,
    rgba(175, 79, 213, 0) 30%,
    rgba(175, 79, 213, 0.9) 100%
  );
}

.inventory-slot-item.gold {
  background: linear-gradient(
    to bottom left,
    rgba(213, 206, 79, 0) 30%,
    rgba(213, 206, 79, 0.9) 100%
  );
}
.inventory-slot-item-img {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
}
.inventory-slot-item-img img {
  max-width: 100%;
  max-height: 100%;
}
.inventory-slot-item-icons {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0 5px;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
}
</style>
<style>
/* if width is changed, update grid-template-colums of .inventory-container in inventoryContainer.vue as well + ITEM_SIZE */
.inventory-slot {
  box-sizing: border-box;
  width: 100px;
  height: 100px;
}
.inventory-slot-item {
  display: grid;
  grid-template-rows: 80fr 20fr;
  /* if border-radius is changed, update sub-container as well */
  border-radius: 5px;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    inset 0 -8px 12px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.6);
}
.inventory-slot-item.selected {
  position: relative;
  box-shadow:
    0 0 0 2px rgba(120, 200, 255, 0.6),
    0 0 12px rgba(120, 200, 255, 0.5),
    0 0 24px rgba(120, 200, 255, 0.3);
  animation: selectionPulse 2.5s ease-in-out infinite;
}

@keyframes selectionPulse {
  0%,
  100% {
    box-shadow:
      0 0 0 2px rgba(120, 200, 255, 0.5),
      0 0 12px rgba(120, 200, 255, 0.4),
      0 0 20px rgba(120, 200, 255, 0.25);
  }
  50% {
    box-shadow:
      0 0 0 2px rgba(160, 220, 255, 0.9),
      0 0 15px rgba(160, 220, 255, 0.7),
      0 0 30px rgba(160, 220, 255, 0.5);
  }
}
.inventory-slot-empty {
  border-radius: 5px;
  background: radial-gradient(
    rgb(210 192 192 / 0%) 10%,
    rgb(37 37 37 / 30%) 100%
  );
  box-shadow: inset 0 0 4px rgb(0 0 0 / 47%);
}
</style>
