import {
  AppError,
  AppErrorCodes,
  Result,
} from "@src/models/BasicAndTempModels";
import {
  ActiveQuestForFrontend,
  questDifficulty,
  QuestItemForFrontend,
  QuestItemProgressionUpdateRequest,
} from "@src/models/quests/QuestsModels";
import { StaticQuestRepository } from "@src/server/infrastructure/repositories/Quests/StaticQuestRepository";
import { ActiveQuestRepository } from "@src/server/infrastructure/repositories/Quests/ActiveQuestRepository";
import { ActiveQuestEntity } from "@src/server/domain/entities/OnGoingQuestEntity";
import {
  toActiveQuestForFrontend,
  toQuestItemForFrontend,
} from "@src/server/domain/mappers/QuestMappers";

export class QuestService {
  private readonly activeQuestRepo: ActiveQuestRepository;
  private readonly staticQuestRepo: StaticQuestRepository;

  constructor(
    activeQuestRepo = new ActiveQuestRepository(),
    staticQuestRepo = new StaticQuestRepository(),
  ) {
    this.activeQuestRepo = activeQuestRepo;
    this.staticQuestRepo = staticQuestRepo;
  }

  /** Business Logic - It represent use cases or actions that the player can perform **/

  /** GETTERS */
  public getAllQuests(): Result<QuestItemForFrontend[]> {
    try {
      const quests = this.staticQuestRepo.getAll();
      // TODO filter quests that are active from this list...
      return [
        quests.map((quest) => {
          return toQuestItemForFrontend(quest);
        }),
        null,
      ];
    } catch (e) {
      console.error("getAllQuests - unexpected error:", e);
      return [
        null,
        new AppError(
          "getAllQuests - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }
  public getQuestById(questId: string): Result<QuestItemForFrontend> {
    try {
      const [quest, errorGetQuest] = this.staticQuestRepo.getById(questId);
      if (errorGetQuest) {
        console.error("getQuestById - error from repo", errorGetQuest.message);
        return [null, errorGetQuest];
      }
      return [toQuestItemForFrontend(quest), null];
    } catch (e) {
      console.error("getQuestById - unexpected error:", e);
      return [
        null,
        new AppError(
          "getQuestById - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  public getAllActiveQuests(): Result<ActiveQuestForFrontend[]> {
    try {
      const quests = this.activeQuestRepo.getAll();
      return [
        quests.map((activeQuest) => {
          return toActiveQuestForFrontend(activeQuest);
        }),
        null,
      ];
    } catch (e) {
      console.error("getAllActiveQuests - unexpected error:", e);
      return [
        null,
        new AppError(
          "getAllActiveQuests - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }
  public getActiveQuestById(questId: string): Result<ActiveQuestForFrontend> {
    try {
      const [quest, errorGetQuest] = this.activeQuestRepo.getById(questId);
      if (errorGetQuest) {
        console.error(
          "getActiveQuestById - error from repo",
          errorGetQuest.message,
        );
        return [null, errorGetQuest];
      }
      return [toActiveQuestForFrontend(quest), null];
    } catch (e) {
      console.error("getActiveQuestById - unexpected error:", e);
      return [
        null,
        new AppError(
          "getActiveQuestById - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  /** MUTATIONS */
  public acceptQuest(
    questId: string,
    difficulty: questDifficulty,
  ): Result<true> {
    try {
      // fetch the static config of the quest with the asked id
      const [quest, errorGetQuest] = this.staticQuestRepo.getById(questId);
      if (!quest) {
        console.error(
          "acceptQuest - getById - error from repo",
          errorGetQuest.message,
        );
        return [null, errorGetQuest];
      }

      // Initialize a new active quest to track user progress on this quest
      const activeQuest = ActiveQuestEntity.fromStaticQuest(quest, difficulty);

      // Add the new quest into the list
      const [isQuestAdded, errorAddQuest] =
        this.activeQuestRepo.insert(activeQuest);
      if (errorAddQuest) {
        console.error(
          "acceptQuest - insert - error from repo",
          errorAddQuest.message,
        );
        return [null, errorAddQuest];
      }

      return [isQuestAdded, null];
    } catch (e) {
      console.error("acceptQuest - unexpected error:", e);
      return [
        null,
        new AppError(
          "acceptQuest - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }
  public cancelQuest(questId: string): Result<true> {
    try {
      const [isQuestRemovedFromActive, errorRemoveQuest] =
        this.activeQuestRepo.removeById(questId);

      if (errorRemoveQuest) {
        console.error(
          "cancelQuest - removeById - error from repo",
          errorRemoveQuest.message,
        );
        return [null, errorRemoveQuest];
      }

      // Additional logic for canceling a quest can go here

      return [isQuestRemovedFromActive, null];
    } catch (e) {
      console.error("cancelQuest - unexpected error:", e);
      return [
        null,
        new AppError(
          "cancelQuest - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  public completeQuest(questId: string): Result<true> {
    try {
      // TODO we deal with giving the rewards to the player

      // TODO we add the quest to the completed list. giving it a uniqId and the chosen difficulty to track repeatable quests

      // we remove the quest from the active ones.
      const [isQuestRemovedFromActive, errorRemoveQuest] =
        this.activeQuestRepo.removeById(questId);

      if (errorRemoveQuest) {
        console.error(
          "completeQuest - removeById - error from repo",
          errorRemoveQuest.message,
        );
        return [null, errorRemoveQuest];
      }

      return [isQuestRemovedFromActive, null];
    } catch (e) {
      console.error("completeQuest - unexpected error:", e);
      return [
        null,
        new AppError(
          "completeQuest - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  public failQuest(questId: string): Result<true> {
    try {
      // we remove the quest from the active ones.
      const [isQuestRemovedFromActive, errorRemoveQuest] =
        this.activeQuestRepo.removeById(questId);

      if (errorRemoveQuest) {
        console.error(
          "failQuest - removeById - error from repo",
          errorRemoveQuest.message,
        );
        return [null, errorRemoveQuest];
      }
      // eventual processing because quest failed
      // TODO we deal with giving the failure penalities to the player

      return [isQuestRemovedFromActive, null];
    } catch (e) {
      console.error("failQuest - unexpected error:", e);
      return [
        null,
        new AppError(
          "failQuest - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  public incrementProgress(
    questId: string,
    progressUpdate: QuestItemProgressionUpdateRequest[],
  ): Result<true> {
    try {
      if (!Array.isArray(progressUpdate) || progressUpdate.length === 0) {
        console.error("incrementProgress - Bad request", progressUpdate);
        return [
          null,
          new AppError(
            `Bad Request`,
            AppErrorCodes.ACTION_NOT_ALLOWED_BAD_REQUEST,
          ),
        ];
      }

      // we fetch the current activeQuest
      const [quest, errorGetQuest] = this.activeQuestRepo.getById(questId);
      if (errorGetQuest || !quest) {
        console.error(
          "incrementProgress - getById - error from repo",
          errorGetQuest.message,
        );
        return [null, errorGetQuest];
      }

      progressUpdate.forEach((el) => {
        quest.incrementTarget(el.idItem, el.quantityToAdd);
      });

      const [isUpdated, errorUpdateQuest] = this.activeQuestRepo.updateById(
        questId,
        quest,
      );
      if (errorUpdateQuest) {
        console.error(
          "incrementProgress - updateById - error from repo",
          errorUpdateQuest.message,
        );
        return [null, errorUpdateQuest];
      }

      return [isUpdated, null];
    } catch (e) {
      console.error("incrementProgress - unexpected error:", e);
      return [
        null,
        new AppError(
          "incrementProgress - unexpected error:",
          AppErrorCodes.ERROR_NOT_FOUND,
        ),
      ];
    }
  }

  initializeQuests(): Result<true> {
    this.staticQuestRepo.restoreDefault();
    this.activeQuestRepo.restoreDefault();
    return [true, null];
  }
}
