import {
  ExtendingDrawingLimits,
  drawingResult,
} from "@src/models/BasicAndTempModels";
import { isEmpty, randomIntNumberInclusive } from "@utils/GeneralUtils";

/* Parameters : 
  - percentSucessvalue : the number base 10 of the success rate. If under 0 -> we return successMinNumber at 100, If over 100 -> we return successMinNumber at 0
  The function convert success rate into the successMinNumber used in isSuccess
*/
export const convertPercentSuccessIntoSuccessMinNumber = (
  percentSucessvalue: number
) => {
  if (percentSucessvalue < 0) {
    return 100;
  }
  if (percentSucessvalue > 100) {
    return 0;
  }
  return 100 - percentSucessvalue;
};

/* Parameters : 
  - successMinNumber : if the draw value is superior or equal to successMinNumber its a success, if inferior => failure
  - useExtendingDrawingResult : (optionnal),default value false, activate the use of more types of success and failures
  - extendingDrawingLimits : (optionnal), Object that contains the int value to separate all level of success and failures
      - To disable a specific limit, put to 0, otherwise put between 1 and 99
*/
export const isSuccess = (
  successMinNumber: number,
  useExtendingDrawingResult = false,
  extendingDrawingLimits?: ExtendingDrawingLimits
): drawingResult => {
  const minimum = 0;
  const maximum = 100;
  if (isEmpty(successMinNumber)) {
    console.error(
      "[isSuccess] Error : invalid successMinNumber ",
      successMinNumber
    );
    return drawingResult.SUCCESS;
  }

  if (
    !useExtendingDrawingResult ||
    !extendingDrawingLimits ||
    isEmpty(extendingDrawingLimits)
  ) {
    return randomIntNumberInclusive(minimum, maximum) >= successMinNumber
      ? drawingResult.SUCCESS
      : drawingResult.FAILURE;
  }
  // get the randomDraw
  const drawResult = randomIntNumberInclusive(minimum, maximum);

  // return the correct outcomes
  if (
    extendingDrawingLimits.criticalFailureLimit &&
    drawResult <= extendingDrawingLimits.criticalFailureLimit &&
    extendingDrawingLimits.criticalFailureLimit !== 0
  ) {
    return drawingResult.CRITICAL_FAILURE;
  } else if (
    (extendingDrawingLimits.marginalFailureLimit &&
      drawResult < extendingDrawingLimits.marginalFailureLimit) ||
    (drawResult < successMinNumber &&
      extendingDrawingLimits.marginalFailureLimit === 0)
  ) {
    return drawingResult.FAILURE;
  } else if (drawResult < successMinNumber) {
    return drawingResult.MARGINAL_FAILURE;
  } else if (
    extendingDrawingLimits.marginalSuccessLimit &&
    drawResult < extendingDrawingLimits.marginalSuccessLimit &&
    extendingDrawingLimits.marginalSuccessLimit !== 0
  ) {
    return drawingResult.MARGINAL_SUCCESS;
  } else if (
    (extendingDrawingLimits.criticalSuccessLimit &&
      drawResult < extendingDrawingLimits.criticalSuccessLimit) ||
    (drawResult >= successMinNumber &&
      extendingDrawingLimits.criticalSuccessLimit === 0)
  ) {
    return drawingResult.SUCCESS;
  } else {
    return drawingResult.CRITICAL_SUCCESS;
  }
};
