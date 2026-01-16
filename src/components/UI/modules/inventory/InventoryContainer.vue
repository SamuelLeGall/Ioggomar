<template>
  <div
    :id="id"
    ref="inventory-ref"
    class="inventory-container"
    :class="{ 'drop-allowed': isDropAllowed }"
    @dragover="onDragOver($event)"
    @dragleave="onDragLeave()"
    @drop="onDrop($event)"
  >
    <template v-for="index in visibleSlots" :key="index">
      <InventoryItem
        v-if="inventoryItems[index - 1]"
        :item-data="inventoryItems[index - 1]"
        :inventory-id="inventoryId"
        @click="handleClick"
      />
      <div v-else class="inventory-slot inventory-slot-empty" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useTemplateRef } from "vue";
import InventoryItem, {
  IClickItemData,
} from "@components/UI/modules/inventory/InventoryItem.vue";
import {
  DragPayload,
  InventoryItemUI,
} from "@src/models/inventory/inventory.frontend.model";
import { InventoryStoreService } from "@src/services/inventory/InventoryStore.service";
import { InventoryApiService } from "@src/services/inventory/InventoryApi.service";

const props = defineProps<{
  inventoryId: string;
  targetInventoryId?: string;
}>();
const attrs = useAttrs();

// STATE
const MIN_SLOTS = 14;
const ITEM_SIZE = 100;
const GAP = 15;

const columns = ref(1);
const inventoryRef = useTemplateRef("inventory-ref");
const isDropAllowed = ref(false);

// API
const inventoryApiService = new InventoryApiService();

// STORE
const inventoryStoreService = new InventoryStoreService();

// COMPUTED
const id = computed<string>(() => {
  if (!attrs?.id) {
    return "default";
  }
  return String(attrs.id);
});
const visibleSlots = computed(() => {
  const itemsCount = inventoryItems.value.length;
  const cols = columns.value || 1;

  // Slots requis pour afficher tous les items (grille complète)
  const requiredSlots = Math.ceil(itemsCount / cols) * cols;

  // Slots minimum UX, arrondis à une grille complète
  const minSlotsRounded = Math.ceil(MIN_SLOTS / cols) * cols;

  return Math.max(requiredSlots, minSlotsRounded);
});
const inventoryItems = computed<InventoryItemUI[]>(() => {
  const inventory = inventoryStoreService.getInventoryById(props.inventoryId);
  if (!inventory) {
    return [];
  }
  return inventory.data;
});

// METHODS
const transfertCompleteStack = (
  sourceInventoryId: string,
  targetInventoryId: string,
  itemId: string,
) => {
  inventoryApiService.transfer(sourceInventoryId, targetInventoryId, [
    { id: itemId },
  ]);
  inventoryStoreService.syncInventoryById(sourceInventoryId);
  inventoryStoreService.syncInventoryById(targetInventoryId);
};
const transfertPartialStack = (
  sourceInventoryId: string,
  targetInventoryId: string,
  itemId: string,
  quantity: number,
) => {
  inventoryApiService.transfer(sourceInventoryId, targetInventoryId, [
    { id: itemId, quantityToTransfer: quantity },
  ]);
  inventoryStoreService.syncInventoryById(sourceInventoryId);
  inventoryStoreService.syncInventoryById(targetInventoryId);
};
const splitStack = (inventoryId: string, itemId: string) => {
  inventoryApiService.split(inventoryId, itemId);
  inventoryStoreService.syncInventoryById(inventoryId);
};

const handleClick = (event: IClickItemData) => {
  if (!props.targetInventoryId) {
    return;
  }

  if (event.ctrlKeyPressed) {
    transfertCompleteStack(
      props.inventoryId,
      props.targetInventoryId,
      event.itemId,
    );
    return;
  } else if (event.shiftKeyPressed) {
    splitStack(props.inventoryId, event.itemId);
    return;
  } else if (event.altKeyPressed) {
    transfertPartialStack(
      props.inventoryId,
      props.targetInventoryId,
      event.itemId,
      1,
    );
  }
};
const onDragLeave = () => {
  isDropAllowed.value = false;
};
const onDragOver = (event: DragEvent) => {
  if (!event.dataTransfer) {
    return;
  }

  if (event.dataTransfer.types.includes(props.inventoryId.toLowerCase())) {
    isDropAllowed.value = false;
    return;
  }

  isDropAllowed.value = true;
  event.preventDefault(); // autorise le drop
};
const onDrop = (event: DragEvent) => {
  if (!event.dataTransfer || !event.dataTransfer.getData("application/json")) {
    return;
  }

  const payload = JSON.parse(event.dataTransfer.getData("application/json"));

  if (payload.fromInventoryId === props.inventoryId) return;

  handleValidDrop(payload);
  isDropAllowed.value = false;
};
const handleValidDrop = (payload: DragPayload) => {
  transfertCompleteStack(
    payload.fromInventoryId,
    props.inventoryId,
    payload.itemId,
  );
};

// HOOKS
onMounted(() => {
  if (!props.inventoryId) {
    throw new Error("Could not load the inventory module.");
  }

  if (!inventoryRef.value) return;
  inventoryStoreService.refreshAllInventories();
  const observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;

    columns.value = Math.max(1, Math.floor((width + GAP) / (ITEM_SIZE + GAP)));
  });

  observer.observe(inventoryRef.value);
});
</script>

<style scoped>
.inventory-container {
  display: grid;
  /* cf css of inventory-slot for why 100px */
  grid-template-columns: repeat(auto-fill, 100px);
  justify-content: space-evenly;
  width: 100%;
  height: fit-content;
  gap: 15px; /* update JS GAP state as well */
  padding: 15px;

  background-color: #22303c;
  border-radius: 5px;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 6%),
    4px 0 18px rgb(0 0 0 / 40%),
    0 2px 4px rgb(0 0 0 / 60%);
}
.inventory-container.drop-allowed {
  outline: 2px dashed rgba(100, 200, 255, 0.8);
  background-color: rgba(100, 200, 255, 0.05);
}
</style>
