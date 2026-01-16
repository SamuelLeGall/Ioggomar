import { TestCase } from "tests/Models/testsModels";
import { handleKeyInputTestCases } from "../mock/KeyMapperComponentMock";

describe("Test of KeyMapperComponent", () => {
  describe("Test of handleKeyInput", () => {
    beforeEach(() => {});
    handleKeyInputTestCases.forEach((testCase: TestCase) => {
      it(testCase.name, () => {
        // given
        const { actionId, keyboardEvent } = testCase.params.actionId;
        // TODO we need to instanciate the vueJS component. Maybe here, maybe on the beforeEach

        // when
        // TODO here we call the method from the vueJS component directly using the params above.

        // then
        // TODO we intercept the emits, confirm the amount of time it was emmited and compare what was emmited to testCase.excpected.paramNameNbEmmitedOrSomething then paramDataEmmitedOrSomething
        expect(error).toStrictEqual(testCase.expected.error);
        // TODO we also check on the ref errorsMessage that errorsMessage[actionId] is the error message emmited (using testCase.expected....) Check null if input valid/some string otherwise.

        // NOTE: we use vitest not jest.
      });
    });
  });
});
