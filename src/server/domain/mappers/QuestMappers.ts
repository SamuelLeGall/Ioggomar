import { ActiveQuestEntity } from "@src/server/domain/entities/OnGoingQuestEntity";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";

export function toActiveQuestForFrontend(
  entity: ActiveQuestEntity,
): ActiveQuestForFrontend {
  return {
    id: entity.getId(),
    staticQuestId: entity.getStaticQuestId(),
    difficultyChosen: entity.getDifficultyChosen(),
    canComplete: entity.canBeCompleted(),
    data: entity.getProgress(),
  };
}

export function toQuestItemForFrontend(
  entity: StaticQuestEntity,
): QuestItemForFrontend {
  // TODO KO because we can call this method before a quest is chosen ...
  const [difficulty] = entity.getQuestDifficulty();
  const [rewards] = entity.getQuestRewards();
  const [penalities] = entity.getQuestPenalities();
  return {
    id: entity.getQuestId(),
    name: entity.getQuestName(),
    description: entity.getQuestDescription(),
    illustration: entity.getQuestIllustration(),
    ...(difficulty && { difficulty: difficulty }),
    ...(rewards && { rewards: rewards }),
    ...(penalities && { penalities: penalities }),
  };
}
