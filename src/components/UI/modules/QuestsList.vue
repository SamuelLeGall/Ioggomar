<template>
  <div class="space-y-6 p-4">
    <div>
      <h1 class="text-2xl font-bold">Active Quests</h1>
      <div v-if="activeQuests.length === 0" class="text-gray-500">
        No active quests at the moment.
      </div>

      <template v-for="quest in activeQuests" :key="quest.id">
        <ActiveQuestItem
          v-if="staticQuestsMap[quest.id]"
          :active-quest="quest"
          :static-quest="staticQuestsMap[quest.id]"
          @updated="syncQuests"
        />
        <div v-else>
          <p>Invalid Active quest with id {{ quest.id }}.</p>
        </div>
      </template>
    </div>
    <div>
      <h1 class="text-2xl font-bold">All Discovered Quests</h1>
      <div v-if="activeQuests.length === 0" class="text-gray-500">
        No active quests at the moment.
      </div>

      <QuestItem
        v-for="quest in quests"
        :key="quest.id"
        :quest="quest"
        @updated="syncQuests"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";
import { QuestStoreService } from "@src/services/quests/QuestStore.service";
import QuestItem from "@components/UI/modules/QuestItem.vue";
import ActiveQuestItem from "@components/UI/modules/ActiveQuestItem.vue";

const activeQuests = computed<ActiveQuestForFrontend[]>(() => {
  return questStoreService.getAllActiveQuests();
});

const quests = computed<QuestItemForFrontend[]>(() => {
  return questStoreService.getAllQuests();
});
const staticQuestsMap = ref<Record<string, QuestItemForFrontend>>({});
const questStoreService = new QuestStoreService();

const syncQuests = () => {
  console.log('sync quests')
  // 1. Sync all Active quests of the store
  questStoreService.syncAllActiveQuests();

  // 2. sync static quest config for each quest
  questStoreService.syncAllQuests();
  const entries = questStoreService.getAllActiveQuests().reduce((acc, q) => {
    const staticData = questStoreService.getQuestById(q.staticQuestId);
    if (staticData) {
      acc.push([q.id, staticData]);
    }
    return acc;
  }, [] as [string, QuestItemForFrontend][]);

  // 3. Map them for lookup
  staticQuestsMap.value = Object.fromEntries(entries);
};

onMounted(() => {
  syncQuests();
});
</script>
