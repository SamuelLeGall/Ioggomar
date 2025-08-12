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
          @quest-state-changed="questStoreService.refreshAllQuests"
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
        @quest-state-changed="questStoreService.refreshAllQuests"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";
import { QuestStoreService } from "@src/services/quests/QuestStore.service";
import QuestItem from "@components/UI/modules/QuestItem.vue";
import ActiveQuestItem from "@components/UI/modules/ActiveQuestItem.vue";

// STATE

// API

// STORE
const questStoreService = new QuestStoreService();

// COMPUTED
const activeQuests = computed<ActiveQuestForFrontend[]>(() => {
  return questStoreService.getAllActiveQuests();
});

const quests = computed<QuestItemForFrontend[]>(() => {
  return questStoreService.getAllQuests();
});

const staticQuestsMap = computed<Record<string, QuestItemForFrontend>>(() => {
  return Object.fromEntries(
    activeQuests.value
      .map((q) => {
        const staticData = quests.value.find(
          (quest) => quest.id === q.staticQuestId,
        );
        return staticData ? [q.id, staticData] : null;
      })
      .filter(
        (entry): entry is [string, QuestItemForFrontend] => entry !== null,
      ),
  );
});

// METHODS

// HOOKS
onMounted(() => {
  questStoreService.refreshAllQuests();
});
</script>
