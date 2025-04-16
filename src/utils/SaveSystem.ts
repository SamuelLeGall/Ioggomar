import { GameService } from "@src/server/services/GameService";
import { PlayerService } from "@src/server/services/PlayerService";
import { QuestService } from "@src/server/services/quests/QuestsService";

// no pinia store at root level only inside setup fonction.
function initServices() {
  const gameService = new GameService();
  const questsService = new QuestService();
  const playerService = new PlayerService();
  return {
    gameService,
    questsService,
    playerService,
  };
}

// METHODS
export const save = async () => {
  const { gameService, questsService, playerService } = initServices();
  const saveData = {
    GameStore: gameService.exportGameState(),
    PlayerStore: playerService.exportPlayerState(),
    QuestsStore: questsService.exportQuestsState(),
  };
  const isSaved = await window.electronAPI.saveGame(JSON.stringify(saveData));
  if (isSaved) {
    console.log("saved");
  }
};
export const load = async () => {
  const { gameService, questsService, playerService } = initServices();
  const gameData = await window.electronAPI.loadGame();
  if (gameData) {
    gameService.initializeGameState(gameData.GameStore);
    playerService.initializePlayerState(gameData.PlayerStore);
    questsService.initializeQuestsState(gameData.QuestsStore);
    console.log("loaded");
  }
};
