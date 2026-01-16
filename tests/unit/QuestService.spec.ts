import {
  acceptQuestTestCases,
  cancelQuestTestCases,
} from "tests/mock/QuestServiceMock";
import { TestCase } from "tests/Models/testsModels";
import { QuestService } from "@src/server/application/quests/quest.service";
import * as generalUtils from "@src/server/utils/GeneralUtils";
import { QuestDifficulty } from "@src/server/models/quests/quest.enums";

describe("Test of QuestService - acceptQuest", () => {
  beforeEach(() => {
    // setActivePinia(createPinia());
  });
  acceptQuestTestCases.forEach((testCase: TestCase) => {
    it(testCase.name, () => {
      // given
      const questId = testCase.params.questId;
      const questInstance = new QuestService();
      if (Array.isArray(testCase.params.questsToAcceptBeforeTest)) {
        testCase.params.questsToAcceptBeforeTest.forEach(
          (testData: { id: string; difficulty: QuestDifficulty }) => {
            questInstance.acceptQuest(testData.id, testData.difficulty);
          },
        );
      }

      vi.spyOn(generalUtils, "generateUUID").mockImplementation(() => {
        const string = "mocked";
        return `${string}-${string}-${string}-${string}-${string}`;
      });

      // when
      const [result, error] = questInstance.acceptQuest(
        questId,
        QuestDifficulty.MEDIUM,
      );

      // then
      expect(error).toStrictEqual(testCase.expected.error);
      expect(result).toStrictEqual(testCase.expected.result);
    });
  });
});

describe("Test of QuestService - cancelQuest", () => {
  // beforeEach(() => {
  //   setActivePinia(createPinia());
  // });
  cancelQuestTestCases.forEach((testCase: TestCase) => {
    it(testCase.name, () => {
      // given
      const questId = testCase.params.questId;

      // when
      const questInstance = new QuestService();
      const [result, error] = questInstance.cancelQuest(questId);

      // then
      expect(error).toStrictEqual(testCase.expected.error);
      expect(result).toStrictEqual(testCase.expected.result);
    });
  });
});
