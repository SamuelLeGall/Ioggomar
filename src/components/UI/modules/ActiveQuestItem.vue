<template>
  <div
    class="quest-card p-4 rounded-2xl shadow-md bg-white flex flex-col gap-4"
  >
    <div class="flex gap-4">
      <img
        :src="staticQuest.illustration"
        alt="Quest Image"
        class="w-24 h-24 rounded-xl object-cover"
      />
      <div class="flex flex-col">
        <h2 class="text-xl font-bold">
          {{ getLabel(staticQuest.name) }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ getLabel(staticQuest.description) }}
        </p>
        <div class="text-sm mt-2">
          <div>
            <strong
              >{{ getLabel(`ActiveQuestItem.outcomes.difficulty`) }}:</strong
            >
            {{
              getLabel(`Constants.Difficulties.${activeQuest.difficultyChosen}`)
            }}
          </div>
          <div v-if="outcomes.rewards">
            <strong
              >{{ getLabel(`ActiveQuestItem.outcomes.rewards.title`) }}:</strong
            >
            <ul>
              <li>
                {{ outcomes.rewards.xp }}
                {{ getLabel(`ActiveQuestItem.outcomes.rewards.xp`) }}
              </li>
              <li>
                {{ outcomes.rewards.gold }}
                {{ getLabel(`ActiveQuestItem.outcomes.rewards.gold`) }}
              </li>
              <li v-if="outcomes.rewards.items">
                {{ outcomes.rewards.items }}
                {{ getLabel(`ActiveQuestItem.outcomes.rewards.items`) }}
              </li>
            </ul>
          </div>
          <div v-if="outcomes.penalties">
            <strong>
              {{
                getLabel(`ActiveQuestItem.outcomes.penalties.title`)
              }}:</strong
            >
            <ul>
              <li v-if="outcomes.penalties.xpReset">
                {{ getLabel(`ActiveQuestItem.outcomes.penalties.xpReset`) }}
              </li>
              <li v-if="outcomes.penalties?.equipmentDropped">
                {{
                  getLabel(
                    `ActiveQuestItem.outcomes.penalties.equipmentDropped`,
                  )
                }}
              </li>
              <li v-if="outcomes.penalties.levelsLost">
                {{ getLabel(`ActiveQuestItem.outcomes.penalties.levelsLost`) }}
                {{ outcomes.penalties.levelsLost }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="progression space-y-2">
      <strong> {{ getLabel(`ActiveQuestItem.progress.title`) }}:</strong>
      <ul>
        <li
          v-for="(goal, index) in activeQuest.data"
          :key="index"
          class="flex justify-between text-sm text-gray-800"
        >
          {{ getLabel(`Loot.${goal.idItem}.name`) }} :
          {{ goal.currentQuantity }} / {{ goal.targetAmount }}
        </li>
      </ul>
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-1 bg-red-100 text-red-600 font-semibold rounded-lg text-sm hover:bg-red-200"
        @click="onCancel"
      >
        {{ getLabel(`ActiveQuestItem.buttons.cancel`) }}
      </button>
      <button
        class="px-4 py-1 bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-200"
        @click="onIncrement"
      >
        {{ getLabel(`ActiveQuestItem.buttons.increment`) }}
      </button>
      <button
        v-if="activeQuest.canComplete"
        class="px-4 py-1 bg-green-100 text-green-700 font-semibold rounded-lg text-sm hover:bg-green-200"
        @click="onComplete"
      >
        {{ getLabel(`ActiveQuestItem.buttons.complete`) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestApiService } from "@src/services/quests/QuestApi.service";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import {
  ActiveQuestUI,
  QuestItemUI,
} from "@src/models/quests/quest.frontend.model";
import { computed } from "vue";

const props = defineProps<{
  activeQuest: ActiveQuestUI;
  staticQuest: QuestItemUI;
}>();

const emit = defineEmits<{
  (e: "quest-state-changed"): void;
}>();

// STATE

// API
const questApiService = new QuestApiService();

// STORE
const settingsStoreService = new SettingsStoreService();

// COMPUTED
const outcomes = computed(() => {
  const outcomes = props.staticQuest.availableDifficulties.find(
    (el) => el.difficulty === props.activeQuest.difficultyChosen,
  );
  if (!outcomes) {
    throw new Error(
      `no outcomes found for "${props.activeQuest.difficultyChosen}" difficulty`,
    );
  }

  return outcomes;
});

// METHODS
const getLabel = (key: string): string => {
  return settingsStoreService.getLabel(key);
};

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
