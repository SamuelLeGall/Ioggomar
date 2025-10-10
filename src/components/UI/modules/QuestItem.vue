<template>
  <div
    class="quest-card p-4 rounded-2xl shadow-md bg-white flex flex-col gap-4"
  >
    <div class="flex gap-4">
      <img
        :src="quest.illustration"
        alt="Quest Image"
        class="w-24 h-24 rounded-xl object-cover"
      />
      <div class="flex flex-col">
        <h2 class="text-xl font-bold">{{ getLabel(quest.name) }}</h2>
        <p class="text-gray-600 text-sm">{{ getLabel(quest.description) }}</p>
      </div>
    </div>

    <select-component
      :options="difficultiesAsOptions"
      :model-value="difficulty"
      @update:model-value="onChangeDifficultyOutcomePreview($event)"
    />

    <div>
      <h2>Rewards:</h2>
      <p><strong>XP :</strong> {{ currentDifficultyOutcomes.rewards.xp }}</p>
      <p>
        <strong>Gold :</strong> {{ currentDifficultyOutcomes.rewards.gold }}
      </p>
      <template v-if="currentDifficultyOutcomes.rewards.items">
        <p><strong>Items :</strong></p>
        <ul>
          <li
            v-for="item in currentDifficultyOutcomes.rewards.items"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </template>
    </div>

    <div v-if="currentDifficultyOutcomes.penalties">
      <h2>Penalties:</h2>
      <p>
        <strong>Current Level XP reset :</strong>
        {{ currentDifficultyOutcomes.penalties.xpReset ? "Yes" : "No" }}
      </p>
      <p>
        <strong>You will loose an equipment :</strong>
        {{
          currentDifficultyOutcomes.penalties.equipmentDropped ? "Yes" : "No"
        }}
      </p>
      <p v-if="currentDifficultyOutcomes.penalties.levelsLost !== undefined">
        <strong>
          You will loose
          {{ currentDifficultyOutcomes.penalties.levelsLost }} levels !
        </strong>
      </p>
      <p>
        <strong>Gold :</strong> {{ currentDifficultyOutcomes.rewards.gold }}
      </p>
      <template v-if="currentDifficultyOutcomes.rewards.items">
        <p><strong>Items :</strong></p>
        <ul>
          <li
            v-for="item in currentDifficultyOutcomes.rewards.items"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
      </template>
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-4 py-1 bg-red-100 text-red-600 font-semibold rounded-lg text-sm hover:bg-red-200"
        @click="onAccept"
      >
        Accept
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QuestApiService } from "@src/services/quests/QuestApi.service";
import { computed, onBeforeMount, ref } from "vue";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";
import { QuestDifficulty } from "@src/models/quests/quest.enums";
import { QuestItemUI } from "@src/models/quests/quest.frontend.model";
import SelectComponent from "@components/UI/UIElements/inputs/Select/SelectComponent.vue";
import { OptionConfig } from "@src/models/BasicAndTempModels";

const props = defineProps<{
  quest: QuestItemUI;
}>();

const emit = defineEmits<{
  (e: "quest-state-changed"): void;
}>();

// STATE
const currentDifficulty = ref<QuestDifficulty>(QuestDifficulty.MEDIUM);

// API
const questApiService = new QuestApiService();

// STORE
const settingsStoreService = new SettingsStoreService();

// COMPUTED
const difficulty = computed(() => {
  return {
    key: currentDifficulty.value.toString(),
    value: getLabel(`Constants.Difficulties.${currentDifficulty.value}`),
  };
});
const difficultiesAsOptions = computed(() => {
  return props.quest.availableDifficulties.map((difficultyOutcomes) => {
    return {
      key: difficultyOutcomes.difficulty.toString(),
      value: getLabel(
        `Constants.Difficulties.${difficultyOutcomes.difficulty}`,
      ),
    };
  });
});
const currentDifficultyOutcomes = computed(() => {
  const outcomes = props.quest.availableDifficulties.find(
    (el) => el.difficulty === currentDifficulty.value,
  );
  if (!outcomes) {
    const defaultOutcomes = props.quest.availableDifficulties[0];
    console.error(
      `no outcomes found for "${currentDifficulty.value}" difficulty - using "${defaultOutcomes.difficulty}" difficulty outcomes`,
    );
    return defaultOutcomes;
  }

  return outcomes;
});

// METHODS
const getLabel = (key: string): string => {
  return settingsStoreService.getLabel(key);
};

const onChangeDifficultyOutcomePreview = (event: OptionConfig) => {
  const newDifficulty = parseInt(event.key, 10);
  if (Number.isNaN(newDifficulty)) {
    console.error(
      `onChangeDifficultyOutcomePreview - Impossible to preview the outcome for '${event.key}' difficulty`,
    );
  }
  currentDifficulty.value = newDifficulty;
};

const onAccept = () => {
  questApiService.accept(props.quest.id, currentDifficulty.value);
  emit("quest-state-changed");
};

// HOOKS
onBeforeMount(() => {
  currentDifficulty.value = props.quest.difficulty;
});
</script>

<style scoped>
.quest-card {
  transition: box-shadow 0.2s ease;
}
.quest-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
</style>
