import { TestCase } from "tests/Models/testsModels";

const handleKeyInputTestCases: TestCase[] = [
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
];

export { handleKeyInputTestCases };
