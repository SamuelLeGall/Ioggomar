<template>
  <div class="quest-card p-4 rounded-2xl shadow-md bg-white flex flex-col gap-4">
    <div class="flex gap-4">
      <img :src="staticQuest.illustration" alt="Quest Image" class="w-24 h-24 rounded-xl object-cover" />
      <div class="flex flex-col">
        <h2 class="text-xl font-bold">
          {{ libelles(staticQuest.name) }}</h2>
        <p class="text-gray-600 text-sm">{{ libelles(staticQuest.description) }}</p>
        <div class="text-sm mt-2">
          <div><strong>Difficulty:</strong> {{ activeQuest.difficultyChosen }}</div>
          <div v-if=" staticQuest.rewards">
            <div><strong>Reward:</strong> {{ staticQuest.rewards.xp }} xp</div>
            <div><strong>Reward:</strong> {{ staticQuest.rewards.gold }} gold</div>
            <div><strong>Reward:</strong> {{ staticQuest.rewards.items }} item</div>
          </div>
          <div v-if="staticQuest.penalities">
            <strong>Penalties:</strong>
              <p>xp reset ? {{staticQuest.penalities.xpReset ? 'Yes': 'No'}}</p>
              <p>equipment loss ? {{staticQuest.penalities.equipementDropped ? 'Yes': 'No'}}</p>
              <p v-if="staticQuest.penalities.levelsLost">nbre of level loss ? {{staticQuest.penalities.levelsLost}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="progression space-y-2">
      <div
        v-for="(goal, index) in activeQuest.data"
        :key="index"
        class="flex justify-between text-sm text-gray-800"
      >
        <p>Item: {{ libelles(`Loot.${goal.idItem}.name`) }}</p>
        <p>{{ goal.currentQuantity }} / {{ goal.targetAmount }}</p>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-1 bg-red-100 text-red-600 font-semibold rounded-lg text-sm hover:bg-red-200"
        @click="onCancel"
      >
        Cancel
      </button>
      <button
        class="px-4 py-1 bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-200"
        @click="onIncrement"
      >
        +1
      </button>
      <button
        v-if="activeQuest.canComplete"
        class="px-4 py-1 bg-green-100 text-green-700 font-semibold rounded-lg text-sm hover:bg-green-200"
        @click="onComplete"
      >
        Complete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ActiveQuestForFrontend, QuestItemForFrontend } from "@src/models/quests/QuestsModels";
import { QuestApiService } from "@src/services/quests/QuestApi.service";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";

const props = defineProps<{
  activeQuest: ActiveQuestForFrontend;
  staticQuest: QuestItemForFrontend;
}>();

const emit = defineEmits<{
  (e: "quest-state-changed"): void;
}>();

// STATE

// API
const questApiService = new QuestApiService();

// STORE
const libelles = new SettingsStoreService().getLocalizationLibelle()

// COMPUTED

// METHODS
const onCancel = () => {
  questApiService.cancel(props.activeQuest.id);
  emit("quest-state-changed");
};

const onIncrement = () => {
  const items = props.activeQuest.data.map((goal) => ({
    idItem: goal.idItem,
    quantityToAdd: 1,
  }));
  questApiService.incrementProgress(props.activeQuest.id, items);
  emit("quest-state-changed");
};

const onComplete = () => {
  questApiService.complete(props.activeQuest.id);
  emit("quest-state-changed");
};

// HOOKS


</script>

<style scoped>
.quest-card {
  transition: box-shadow 0.2s ease;
}
.quest-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
