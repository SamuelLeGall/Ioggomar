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
        <h2 class="text-xl font-bold">{{ libelles(quest.name) }}</h2>
        <p class="text-gray-600 text-sm">{{ libelles(quest.description) }}</p>
      </div>
    </div>
    <div v-if="showError">
      Please choose a difficulty to accept the quest and try again
    </div>
    <!--    KO at the moment work on difficultiesAsOptions because it not the right format at the moment-->
    <!--    <select-component-->
    <!--      :options="difficultiesAsOptions"-->
    <!--      :model-value="difficulty"-->
    <!--      @update:model-value="difficulty = $event"-->
    <!--    />-->

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
import {
  questDifficulty,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";
import { QuestApiService } from "@src/services/quests/QuestApi.service";
import { ref } from "vue";
import { SettingsStoreService } from "@src/services/game/SettingsStore.service";

const props = defineProps<{
  quest: QuestItemForFrontend;
}>();

const emit = defineEmits<{
  (e: "quest-state-changed"): void;
}>();

interface OptionConfigDifficulty {
  key: questDifficulty;
  value: string;
}

// STATE
const showError = ref<boolean>(false);
// const difficulty = ref<OptionConfigDifficulty | null>(null);

// API
const questApiService = new QuestApiService();

// STORE
const libelles = new SettingsStoreService().getLocalizationLibelle();


// COMPUTED
// const difficultiesAsOptions = computed<OptionConfigDifficulty[]>(()=>{
//   return Object.entries(questDifficulty).map(([key,value]) => {
//     return {  key:value, value: key.toLowerCase()};
//   }) as OptionConfigDifficulty[];
// });

// METHODS
const onAccept = () => {
  // if (difficulty.value === null) {
  //   showError.value = true;
  //   return;
  // }
  // showError.value = false;
  // questApiService.accept(props.quest.id,difficulty.value.key);

  // TEMP
  questApiService.accept(props.quest.id, questDifficulty.MEDIUM);
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
