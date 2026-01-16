import { TestCase } from "tests/Models/testsModels";
import { QuestDifficulty } from "@src/server/models/quests/quest.enums";

const acceptQuestTestCases: TestCase[] = [
  {
    name: "quest id does not exist - return an error and no data",
    params: {
      questId: "TEST_NON_PRESENT",
    },
    expected: {
      result: null,
      error: "The requested quest could not be found.",
    },
  },
  {
    name: "quest id exist but is already active - return an error and no data",
    params: {
      questId: "loc1_quest002",
      questsToAcceptBeforeTest: [
        { id: "loc1_quest002", difficulty: QuestDifficulty.MEDIUM },
      ],
    },
    expected: {
      result: null,
      error: `The requested active quest already exists.`,
    },
  },
  {
    name: "quest id exist - return the data and no error",
    params: {
      questId: "loc1_quest001",
    },
    expected: {
      result: true,
      error: null,
    },
  },
];

const cancelQuestTestCases: TestCase[] = [
  {
    name: "quest id does not exist - return an error and no data",
    params: {
      questId: "TEST_NON_PRESENT",
    },
    expected: {
      result: null,

      error: "The requested ActiveQuest could not be found.",
    },
  },
  // {
  //   name: "quest id exist but is not active - return an error and no data",
  //   params: {
  //     questId: "loc1_quest001",
  //   },
  //   expected: {
  //     result: null,
  //     error: "The requested ActiveQuest could not be found.",
  //   },
  // },
  // {
  //   name: "quest id exist and is active - return the data and no error",
  //   params: {
  //     questId: "loc1_quest002",
  //   },
  //   expected: {
  //     result: true,
  //     error: null,
  //   },
  // },
];

export { acceptQuestTestCases, cancelQuestTestCases };
