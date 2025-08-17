import {
  ErrorFactory,
  FrontendResult,
  Result,
  ResultFactory,
} from "@src/models/BasicAndTempModels";
import {
  ActiveQuestForFrontend,
  questDifficulty,
  QuestItemForFrontend,
  QuestItemProgressionUpdateRequest,
} from "@src/models/quests/QuestsModels";
import { StaticQuestRepository } from "@src/server/infrastructure/repositories/Quests/StaticQuestRepository";
import { ActiveQuestRepository } from "@src/server/infrastructure/repositories/Quests/ActiveQuestRepository";
import { ActiveQuestEntity } from "@src/server/domain/entities/ActiveQuestEntity";
import {
  toActiveQuestForFrontend,
  toQuestItemForFrontend,
} from "@src/server/domain/mappers/QuestMappers";

export class QuestService {
  private readonly instanceName = "QuestService";
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
  public getAllQuests(): FrontendResult<QuestItemForFrontend[]> {
    try {
      const resultGetQuests = this.staticQuestRepo.getAll();
      if (ResultFactory.isError(resultGetQuests)) {
        const [, errorGetQuests] = resultGetQuests;
        errorGetQuests.logToConsole();
        return [null, errorGetQuests.getPublicMessage()];
      }
      const [quests] = resultGetQuests;

      const questsFrontend: QuestItemForFrontend[] = [];
      for (const quest of quests) {
        const resultMapFrontend = toQuestItemForFrontend(quest);
        if (ResultFactory.isError(resultMapFrontend)) {
          const [, errorMapFrontend] = resultMapFrontend;
          errorMapFrontend.logToConsole();
          return [null, errorMapFrontend.getPublicMessage()];
        }
        const [questForFrontend] = resultMapFrontend;
        questsFrontend.push(questForFrontend);
      }

      return [questsFrontend, null];
    } catch (e) {
      console.error("getAllQuests - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }
  public getQuestById(questId: string): FrontendResult<QuestItemForFrontend> {
    try {
      const resultGetQuest = this.staticQuestRepo.getById(questId);
      if (ResultFactory.isError(resultGetQuest)) {
        const [, errorGetQuest] = resultGetQuest;
        errorGetQuest.logToConsole();
        return [null, errorGetQuest.getPublicMessage()];
      }
      const [quest] = resultGetQuest;

      const resultMapFrontend = toQuestItemForFrontend(quest);
      if (ResultFactory.isError(resultMapFrontend)) {
        const [, errorMapFrontend] = resultMapFrontend;
        errorMapFrontend.logToConsole();
        return [null, errorMapFrontend.getPublicMessage()];
      }
      const [questFrontend] = resultMapFrontend;

      return [questFrontend, null];
    } catch (e) {
      console.error("getQuestById - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public getAllActiveQuests(): FrontendResult<ActiveQuestForFrontend[]> {
    try {
      const resultGetQuests = this.activeQuestRepo.getAll();
      if (ResultFactory.isError(resultGetQuests)) {
        const [, errorGetQuests] = resultGetQuests;
        errorGetQuests.logToConsole();
        return [null, errorGetQuests.getPublicMessage()];
      }
      const [quests] = resultGetQuests;

      const questsFrontend: ActiveQuestForFrontend[] = [];
      for (const activeQuest of quests) {
        const resultMapFrontend = toActiveQuestForFrontend(activeQuest);
        if (ResultFactory.isError(resultMapFrontend)) {
          const [, errorMapFrontend] = resultMapFrontend;
          errorMapFrontend.logToConsole();
          return [null, errorMapFrontend.getPublicMessage()];
        }
        const [questForFrontend] = resultMapFrontend;
        questsFrontend.push(questForFrontend);
      }

      return [questsFrontend, null];
    } catch (e) {
      console.error("getAllActiveQuests - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }
  public getActiveQuestById(
    questId: string,
  ): FrontendResult<ActiveQuestForFrontend> {
    try {
      const resultGetQuest = this.activeQuestRepo.getById(questId);
      if (ResultFactory.isError(resultGetQuest)) {
        const [, errorGetQuest] = resultGetQuest;
        errorGetQuest.logToConsole();
        return [null, errorGetQuest.getPublicMessage()];
      }
      const [quest] = resultGetQuest;

      const resultMapFrontend = toActiveQuestForFrontend(quest);
      if (ResultFactory.isError(resultMapFrontend)) {
        const [, errorMapFrontend] = resultMapFrontend;
        errorMapFrontend.logToConsole();
        return [null, errorMapFrontend.getPublicMessage()];
      }
      const [activeQuest] = resultMapFrontend;

      return [activeQuest, null];
    } catch (e) {
      console.error("getActiveQuestById - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  /** MUTATIONS */
  public acceptQuest(
    questId: string,
    difficulty: questDifficulty,
  ): FrontendResult<true> {
    try {
      // fetch the static config of the quest with the asked id
      const resultGetQuest = this.staticQuestRepo.getById(questId);
      if (ResultFactory.isError(resultGetQuest)) {
        const [, errorGetQuest] = resultGetQuest;
        errorGetQuest.logToConsole();
        return [null, errorGetQuest.getPublicMessage()];
      }
      const [quest] = resultGetQuest;

      // Initialize a new active quest to track user progress on this quest
      const resultInitializeQuest = ActiveQuestEntity.fromStaticQuest(
        quest,
        difficulty,
      );
      if (ResultFactory.isError(resultInitializeQuest)) {
        const [, errorInitializeQuest] = resultInitializeQuest;
        errorInitializeQuest.logToConsole();
        return [null, errorInitializeQuest.getPublicMessage()];
      }
      const [activeQuest] = resultInitializeQuest;

      // Add the new quest into the list
      const resultQuestSaved = this.activeQuestRepo.save(activeQuest);
      if (ResultFactory.isError(resultQuestSaved)) {
        const [, errorQuestSaved] = resultQuestSaved;
        errorQuestSaved.logToConsole();
        return [null, errorQuestSaved.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error("acceptQuest - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }
  public cancelQuest(questId: string): FrontendResult<true> {
    try {
      const resultRemoveQuest = this.activeQuestRepo.remove(questId);
      if (ResultFactory.isError(resultRemoveQuest)) {
        const [, errorRemoveQuest] = resultRemoveQuest;
        errorRemoveQuest.logToConsole();
        return [null, errorRemoveQuest.getPublicMessage()];
      }

      // Additional logic for canceling a quest can go here

      return [true, null];
    } catch (e) {
      console.error("cancelQuest - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public completeQuest(questId: string): FrontendResult<true> {
    try {
      // TODO we deal with giving the rewards to the player

      // TODO we add the quest to the completed list. giving it a uniqId and the chosen difficulty to track repeatable quests

      // we remove the quest from the active ones.
      const resultRemoveQuest = this.activeQuestRepo.remove(questId);
      if (ResultFactory.isError(resultRemoveQuest)) {
        const [, errorRemoveQuest] = resultRemoveQuest;
        errorRemoveQuest.logToConsole();
        return [null, errorRemoveQuest.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error("completeQuest - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public failQuest(questId: string): FrontendResult<true> {
    try {
      // we remove the quest from the active ones.
      const resultRemoveQuest = this.activeQuestRepo.remove(questId);
      if (ResultFactory.isError(resultRemoveQuest)) {
        const [, errorRemoveQuest] = resultRemoveQuest;
        errorRemoveQuest.logToConsole();
        return [null, errorRemoveQuest.getPublicMessage()];
      }

      // eventual processing because quest failed
      // TODO we deal with giving the failure penalities to the player

      return [true, null];
    } catch (e) {
      console.error("failQuest - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public incrementProgress(
    questId: string,
    progressUpdate: QuestItemProgressionUpdateRequest[],
  ): FrontendResult<true> {
    try {
      if (!Array.isArray(progressUpdate) || progressUpdate.length === 0) {
        console.error("incrementProgress - Bad request", progressUpdate);
        return [null, "Bad Request"];
      }

      // we fetch the current activeQuest
      const resultGetQuest = this.activeQuestRepo.getById(questId);
      if (ResultFactory.isError(resultGetQuest)) {
        const [, errorGetQuest] = resultGetQuest;
        errorGetQuest.logToConsole();
        return [null, errorGetQuest.getPublicMessage()];
      }
      const [quest] = resultGetQuest;

      for (const progressOneGoal of progressUpdate) {
        const resultIncrementTarget = quest.incrementTarget(
          progressOneGoal.idItem,
          progressOneGoal.quantityToAdd,
        );
        if (ResultFactory.isError(resultIncrementTarget)) {
          const [, errorIncrementTarget] = resultIncrementTarget;
          errorIncrementTarget.logToConsole();
          return [null, errorIncrementTarget.getPublicMessage()];
        }
      }

      const resultSave = this.activeQuestRepo.save(quest);
      if (ResultFactory.isError(resultSave)) {
        const [, errorSave] = resultSave;
        errorSave.logToConsole();
        return [null, errorSave.getPublicMessage()];
      }

      return [true, null];
    } catch (e) {
      console.error("incrementProgress - unexpected error:", e);
      return [null, "Internal Server Error"];
    }
  }

  public initializeQuests(): Result<true> {
    try {
      const resultRestoreDefaultStatic = this.staticQuestRepo.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefaultStatic)) {
        const [, errorRestoreActive] = resultRestoreDefaultStatic;
        return [
          null,
          ErrorFactory.chainError(
            errorRestoreActive,
            ErrorFactory.createContext("Service", "initializeQuests", {
              instanceName: this.instanceName,
            }),
          ),
        ];
      }

      const resultRestoreDefaultActive = this.activeQuestRepo.restoreDefault();
      if (ResultFactory.isError(resultRestoreDefaultActive)) {
        const [, errorRestoreActive] = resultRestoreDefaultActive;
        return [
          null,
          ErrorFactory.chainError(
            errorRestoreActive,
            ErrorFactory.createContext("Service", "initializeQuests", {
              instanceName: this.instanceName,
            }),
          ),
        ];
      }

      return [true, null];
    } catch (e) {
      return [
        null,
        ErrorFactory.unexpectedError(
          ErrorFactory.createContext("Service", "initializeSettings", {
            instanceName: this.instanceName,
          }),
          e,
        ),
      ];
    }
  }
}
