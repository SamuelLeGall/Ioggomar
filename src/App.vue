<template>
  <router-view @save="save" @load="load" @resume="resumeGame" @new-game="newGame" />
</template>
<script setup lang="ts">
import { GameContextApiService } from "@src/services/game/GameContextApi.service";
import { GameContextStoreService } from "@src/services/game/GameContextStore.service";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

// COMPOSABLES
const router = useRouter()

// API
const gameApiService = new GameContextApiService();

// STORE
const gameContextStoreService = new GameContextStoreService()

// STATE

// METHODS
const goToTestGround = ()=>{
  router.push({
    name: 'TEST_GROUND',
  })
}
const save = async () => {
  await gameApiService.save();
};

const load = async () => {
  const success = await gameApiService.load();
  if (success) {
    gameContextStoreService.initialSyncAfterLoad()
    goToTestGround();
  }
};

const newGame = () =>{
  gameApiService.initialize();
  goToTestGround();
}
const resumeGame = () =>{
  gameApiService.resume();
  goToTestGround();
}


// HOOKS
onBeforeMount(() => {
  gameContextStoreService.initialSyncAfterLoad()
});
</script>