<template>
  <div
    id="main-menu-container"
    class="display-flex flex-direction-column flex-fill gap-1em flex-center"
  >
    <p>Player level {{ playerLevel }}</p>
    <button @click="updatePlayerLevel(1)">lvl + 1</button>
    <hr />
    <router-link :to="{ name: 'HELLO_WORLD' }"> HelloWorld </router-link>

    <button @click="$emit('save')">
      {{ libelles("MainMenuMessage.MainMenu.saveButton") }}
    </button>
    <button @click="$emit('load')">
      {{ libelles("MainMenuMessage.MainMenu.loadButton") }}
    </button>
    <hr />
    <ul>
      <li>Hover → preview (SOON)</li>
      <li>Click gauche → sélection(SOON)</li>
      <li>Click droit → menu(SOON)</li>
      <li>Ctrl + Click → transfert stack</li>
      <li>Shift + Click → split</li>
      <li>Drag → transfert stack</li>

      // transfer 1 // transfer customAmount // transfer current stack //
      transfer All stacks
    </ul>
    <div class="inventory-playground">
      <InventoryContainer
        inventory-id="player"
        target-inventory-id="store_001"
      />
      <InventoryContainer
        inventory-id="store_001"
        target-inventory-id="player"
      />
    </div>
    <hr />
    <QuestsList />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import QuestsList from "@src/public/components/UI/modules/quests/QuestsList.vue";
import { PlayerApiService } from "@src/public/services/player/PlayerApi.service";
import { PlayerStoreService } from "@src/public/services/player/PlayerStore.service";
import { SettingsStoreService } from "@src/public/services/game/SettingsStore.service";
import InventoryContainer from "@src/public/components/UI/modules/inventory/InventoryContainer.vue";

export default defineComponent({
  name: "MainMenu",
  components: {
    InventoryContainer,
    QuestsList,
  },
  emits: ["save", "load"],
  setup() {
    // API
    const playerApiService = new PlayerApiService();

    // STORE
    const settingsStoreService = new SettingsStoreService();
    const playerStoreService = new PlayerStoreService();

    // STATE

    // METHODS
    const updatePlayerLevel = (nbLevelsToAdd: number) => {
      playerApiService.levelUp(nbLevelsToAdd);
      playerStoreService.syncPlayer();
    };

    // COMPUTED
    const libelles = computed(() => {
      return settingsStoreService.getLocalizationLibelle();
    });

    const playerLevel = computed(() => {
      return playerStoreService.getPlayer().level;
    });

    return {
      libelles,
      playerLevel,
      updatePlayerLevel,
    };
  },
});
</script>
<style lang="scss" scoped>
.inventory-playground {
  width: 80%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4em;
}
</style>
