import { acceptQuestTestCases } from "tests/mock/QuestServiceMock";
import { TestCase } from "tests/Models/testsModels";
import { createPinia, setActivePinia } from "pinia";
import { QuestService } from "@src/server/application/quests/quest.service";
import { questDifficulty } from "@src/models/quests/QuestsModels";

describe("Test of QuestService - acceptQuest", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  acceptQuestTestCases.forEach((testCase: TestCase) => {
    it(testCase.name, () => {
      // given
      const questId = testCase.params.questId;

      // when
      const questInstance = new QuestService();
      const [result, error] = questInstance.acceptQuest(
        questId,
        questDifficulty.MEDIUM
      );

      // then
      if (testCase.expected.error) {
        expect(error?.message).toStrictEqual(testCase.expected.error.message);
      } else {
        expect(error).toStrictEqual(testCase.expected.error);
      }
      expect(result).toStrictEqual(testCase.expected.result);
    });
  });
});

describe("Test of QuestService - cancelQuest", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  acceptQuestTestCases.forEach((testCase: TestCase) => {
    it(testCase.name, () => {
      // given
      const questId = testCase.params.questId;

      // when
      const questInstance = new QuestService();
      const [result, error] = questInstance.cancelQuest(questId);

      // then
      if (testCase.expected.error) {
        expect(error?.message).toStrictEqual(testCase.expected.error.message);
      } else {
        expect(error).toStrictEqual(testCase.expected.error);
      }
      expect(result).toStrictEqual(testCase.expected.result);
    });
  });
});
