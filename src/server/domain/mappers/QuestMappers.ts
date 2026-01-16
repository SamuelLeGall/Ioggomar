import { ActiveQuestEntity } from "@src/server/domain/entities/ActiveQuestEntity";
import { StaticQuestEntity } from "@src/server/domain/entities/StaticQuestEntity";
import {
  ErrorFactory,
  Result,
  ResultFactory,
} from "@src/server/models/BasicAndTempModels";
import {
  ActiveQuestUI,
  QuestItemDifficultyOutcomesUI,
  QuestItemUI,
} from "@src/server/models/quests/quest.frontend.model";

export function toActiveQuestUI(
  entity: ActiveQuestEntity,
): Result<ActiveQuestUI> {
  try {
    const result: ActiveQuestUI = {
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
          ErrorFactory.createContext("Mapper", "toActiveQuestUI", {
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
        ErrorFactory.createContext("Mapper", "toActiveQuestUI", {
          questId: entity.getId(),
          staticQuestId: entity.getStaticQuestId(),
        }),
        e,
      ),
    ];
  }
}

function processDifficultyDependentData(
  entity: StaticQuestEntity,
): Result<QuestItemDifficultyOutcomesUI> {
  const resGetRewards = entity.getQuestRewards();
  if (ResultFactory.isError(resGetRewards)) {
    const [, errorGetRewards] = resGetRewards;
    return [
      null,
      ErrorFactory.chainError(
        errorGetRewards,
        ErrorFactory.createContext("Mapper", "processDifficultyDependentData", {
          questId: entity.getQuestId(),
          difficulty: entity.getQuestDifficulty(),
        }),
      ),
    ];
  }
  const [rewards] = resGetRewards;
  const result: QuestItemDifficultyOutcomesUI = {
    difficulty: entity.getQuestDifficulty(),
    rewards,
  };

  const resGetPenalties = entity.getQuestPenalties();
  if (ResultFactory.isError(resGetPenalties)) {
    const [, errorGetPenalties] = resGetPenalties;
    return [
      null,
      ErrorFactory.chainError(
        errorGetPenalties,
        ErrorFactory.createContext("Mapper", "processDifficultyDependentData", {
          questId: entity.getQuestId(),
          difficulty: entity.getQuestDifficulty(),
        }),
      ),
    ];
  }
  const [penalties] = resGetPenalties;
  if (penalties) {
    result.penalties = penalties;
  }

  return [result, null];
}
export function toQuestItemUI(entity: StaticQuestEntity): Result<QuestItemUI> {
  try {
    const questItem: QuestItemUI = {
      id: entity.getQuestId(),
      name: entity.getQuestName(),
      description: entity.getQuestDescription(),
      illustration: entity.getQuestIllustration(),
      difficulty: entity.getQuestDifficulty(),
      availableDifficulties: [],
    };
    const availableDifficulties = entity.getQuestAvailableDifficulties();

    availableDifficulties.forEach((difficulty) => {
      entity.setDifficulty(difficulty);
      const resDifficultyOutcomes = processDifficultyDependentData(entity);
      if (ResultFactory.isError(resDifficultyOutcomes)) {
        const [, errorDifficultyOutcomes] = resDifficultyOutcomes;
        return [
          null,
          ErrorFactory.chainError(
            errorDifficultyOutcomes,
            ErrorFactory.createContext("Mapper", "toQuestItemUI", {
              questId: entity.getQuestId(),
              difficulty: entity.getQuestDifficulty(),
            }),
          ),
        ];
      }
      const [outcomes] = resDifficultyOutcomes;
      questItem.availableDifficulties.push(outcomes);
    });

    return [questItem, null];
  } catch (e) {
    return [
      null,
      ErrorFactory.unexpectedError(
        ErrorFactory.createContext("Mapper", "toQuestItemUI", {
          questId: entity.getQuestId(),
        }),
        e,
      ),
    ];
  }
}
