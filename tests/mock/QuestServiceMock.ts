import { AppError, AppErrorCodes } from "@src/domain/models/BasicAndTempModels";
import { TestCase } from "tests/Models/testsModels";

const acceptQuestTestCases: TestCase[] = [
  {
    name: "quest id does not exist - return an error and no data",
    params: {
      questId: "TEST_NON_PRESENT",
    },
    expected: {
      result: null,
      error: new AppError(
        `No quest found for id TEST_NON_PRESENT`,
        AppErrorCodes.RESOURCE_NOT_FOUND
      ),
    },
  },
  {
    name: "quest id exist but is already ongoing - return an error and no data",
    params: {
      questId: "loc1_quest002",
    },
    expected: {
      result: null,
      error: new AppError(
        `Quest with id loc1_quest002 already ongoing`,
        AppErrorCodes.ACTION_NOT_ALLOWED_DATA_CONSISTENCY
      ),
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
      error: new AppError(
        `No ongoing quest found for id TEST_NON_PRESENT`,
        AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
      ),
    },
  },
  {
    name: "quest id exist but is not ongoing - return an error and no data",
    params: {
      questId: "loc1_quest001",
    },
    expected: {
      result: null,
      error: new AppError(
        `No ongoing quest found for id loc1_quest001`,
        AppErrorCodes.RESOURCE_NOT_FOUND_FOR_THIS_CONTEXT
      ),
    },
  },
  {
    name: "quest id exist and is ongoing - return the data and no error",
    params: {
      questId: "loc1_quest002",
    },
    expected: {
      result: true,
      error: null,
    },
  },
];

export { acceptQuestTestCases, cancelQuestTestCases };
