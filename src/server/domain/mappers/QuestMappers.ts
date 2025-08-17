import { ActiveQuestEntity } from "@src/server/domain/entities/ActiveQuestEntity";
import {
  ActiveQuestForFrontend,
  QuestItemForFrontend,
} from "@src/models/quests/QuestsModels";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";

export function toActiveQuestForFrontend(
  entity: ActiveQuestEntity,
): Result<ActiveQuestForFrontend> {
  try {
    const result: ActiveQuestForFrontend = {
      id: entity.getId(),
      staticQuestId: entity.getStaticQuestId(),
      difficultyChosen: entity.getDifficultyChosen(),
      data: entity.getProgress(),
      canComplete: false,
    };

    const resBeCompleted = entity.canBeCompleted();
    if (ResultFactory.isError(resBeCompleted)) {
      const [, errorBeCompleted] = resBeCompleted;
      return [
        null,
        ErrorFactory.chainError(
          errorBeCompleted,
          ErrorFactory.createContext("Mapper", "toActiveQuestForFrontend", {
            questId: entity.getId(),
            staticQuestId: entity.getStaticQuestId(),
          }),
        ),
      ];
    }

    const [canBeCompleted] = resBeCompleted;
    result.canComplete = canBeCompleted;

    return [result, null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toActiveQuestForFrontend", {
          questId: entity.getId(),
          staticQuestId: entity.getStaticQuestId(),
        }),
        e,
      ),
    ];
  }
}

export function toQuestItemForFrontend(
  entity: StaticQuestEntity,
): Result<QuestItemForFrontend> {
  try {
    const questItem: QuestItemForFrontend = {
      id: entity.getQuestId(),
      name: entity.getQuestName(),
      description: entity.getQuestDescription(),
      illustration: entity.getQuestIllustration(),
      availableDifficulties: entity.getQuestAvailableDifficulties(),
    };

    if (entity.haveDifficultySelected()) {
      const resGetDifficulty = entity.getQuestDifficulty();
      if (ResultFactory.isError(resGetDifficulty)) {
        const [, errorGetDifficulty] = resGetDifficulty;
        return [
          null,
          ErrorFactory.chainError(
            errorGetDifficulty,
            ErrorFactory.createContext("Mapper", "toQuestItemForFrontend", {
              questId: entity.getQuestId(),
            }),
          ),
        ];
      }
      const [difficulty] = resGetDifficulty;
      questItem.difficulty = difficulty;

      const resGetRewards = entity.getQuestRewards();
      if (ResultFactory.isError(resGetRewards)) {
        const [, errorGetRewards] = resGetRewards;
        return [
          null,
          ErrorFactory.chainError(
            errorGetRewards,
            ErrorFactory.createContext("Mapper", "toQuestItemForFrontend", {
              questId: entity.getQuestId(),
            }),
          ),
        ];
      }
      const [rewards] = resGetRewards;
      questItem.rewards = rewards;

      const resGetPenalities = entity.getQuestPenalities();
      if (ResultFactory.isError(resGetPenalities)) {
        const [, errorGetPenalities] = resGetPenalities;
        return [
          null,
          ErrorFactory.chainError(
            errorGetPenalities,
            ErrorFactory.createContext("Mapper", "toQuestItemForFrontend", {
              questId: entity.getQuestId(),
            }),
          ),
        ];
      }
      const [penalities] = resGetPenalities;
      if (penalities) {
        questItem.penalities = penalities;
      }
    }

    return [questItem, null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toQuestItemForFrontend", {
          questId: entity.getQuestId(),
        }),
        e,
      ),
    ];
  }
}
