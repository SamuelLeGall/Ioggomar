import { drawingResult } from "@src/server/models/BasicAndTempModels";

export const isSuccessMockedDrawResult = 40;
export const drawingLimitsMock = {
  criticalFailureLimit: 10,
  marginalFailureLimit: 35,
  marginalSuccessLimit: 60,
  criticalSuccessLimit: 90,
};

export const isSuccessInvalidParameters = [
  {
    name: "Test of isSuccess, return SUCCESS, extendingDrawingLimits undefined",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: undefined,
  },
  {
    name: "Test of isSuccess, return SUCCESS, extendingDrawingLimits null",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: null,
  },
  {
    name: "Test of isSuccess, return SUCCESS, extendingDrawingLimits {}",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: {},
  },
  {
    name: "Test of isSuccess, return SUCCESS, invalid extendingDrawingLimits, criticalFailureLimit only",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: {
      criticalFailureLimit: 10,
    },
  },
  {
    name: "Test of isSuccess, return SUCCESS, invalid extendingDrawingLimits, one parameter null",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: {
      criticalFailureLimit: null,
      marginalFailureLimit: 35,
      marginalSuccessLimit: 60,
      criticalSuccessLimit: 90,
    },
  },
  {
    name: "Test of isSuccess, return SUCCESS, invalid extendingDrawingLimits, one parameter undefined",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: {
      criticalFailureLimit: undefined,
      marginalFailureLimit: 35,
      marginalSuccessLimit: 60,
      criticalSuccessLimit: 90,
    },
  },
  {
    name: "Test of isSuccess, return SUCCESS, invalid extendingDrawingLimits, one parameter string",
    successMinNumber: 40,
    useExtendingDrawingResult: true,
    extendingDrawingLimits: {
      criticalFailureLimit: "10",
      marginalFailureLimit: 35,
      marginalSuccessLimit: 60,
      criticalSuccessLimit: 90,
    },
  },
  //   {
  //     name: "Test of isSuccess, return SUCCESS, invalid successMinNumber",
  //     successMinNumber: undefined,
  //     useExtendingDrawingResult: false,
  //     extendingDrawingLimits: {},
  //   },
  //   {
  //     name: "Test of isSuccess, return SUCCESS, invalid successMinNumber",
  //     successMinNumber: null,
  //     useExtendingDrawingResult: false,
  //     extendingDrawingLimits: {},
  //   },
  //   {
  //     name: "Test of isSuccess, return SUCCESS, invalid successMinNumber",
  //     successMinNumber: "30",
  //     useExtendingDrawingResult: false,
  //     extendingDrawingLimits: {},
  //   },
];
export const isSuccessNoAdditionnalsLimitsDrawingResult = [
  {
    name: "Test of isSuccess, return FAILURE, under minLimit",
    randomIntNumberInclusiveMockResult: -10,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE, equal minLimit",
    randomIntNumberInclusiveMockResult: 0,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE",
    randomIntNumberInclusiveMockResult: 20,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE, successMinNumber edge under",
    randomIntNumberInclusiveMockResult: 39,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return SUCCESS, equal successMinNumber",
    randomIntNumberInclusiveMockResult: 40,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, successMinNumber edge over",
    randomIntNumberInclusiveMockResult: 41,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS",
    randomIntNumberInclusiveMockResult: 42,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS",
    randomIntNumberInclusiveMockResult: 99,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, equal maxLimit",
    randomIntNumberInclusiveMockResult: 100,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, overLimit",
    randomIntNumberInclusiveMockResult: 120,
    expectedResult: drawingResult.SUCCESS,
  },
];
export const isSuccessWithAdditionnalsLimitsDrawingResult = [
  {
    name: "Test of isSuccess, return CRITICAL_FAILURE, under minLimit",
    randomIntNumberInclusiveMockResult: -10,
    expectedResult: drawingResult.CRITICAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return CRITICAL_FAILURE, equal minLimit",
    randomIntNumberInclusiveMockResult: 0,
    expectedResult: drawingResult.CRITICAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return CRITICAL_FAILURE",
    randomIntNumberInclusiveMockResult: 5,
    expectedResult: drawingResult.CRITICAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return CRITICAL_FAILURE, criticalFailureLimit edge under",
    randomIntNumberInclusiveMockResult: 9,
    expectedResult: drawingResult.CRITICAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return CRITICAL_FAILURE, equal criticalFailureLimit",
    randomIntNumberInclusiveMockResult: 10,
    expectedResult: drawingResult.CRITICAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE, criticalFailureLimit edge over",
    randomIntNumberInclusiveMockResult: 11,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE",
    randomIntNumberInclusiveMockResult: 20,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return FAILURE, marginalFailureLimit edge under",
    randomIntNumberInclusiveMockResult: 34,
    expectedResult: drawingResult.FAILURE,
  },
  {
    name: "Test of isSuccess, return MARGINAL_FAILURE, equal marginalFailureLimit",
    randomIntNumberInclusiveMockResult: 35,
    expectedResult: drawingResult.MARGINAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return MARGINAL_FAILURE, marginalFailureLimit edge over",
    randomIntNumberInclusiveMockResult: 36,
    expectedResult: drawingResult.MARGINAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return MARGINAL_FAILURE",
    randomIntNumberInclusiveMockResult: 38,
    expectedResult: drawingResult.MARGINAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return MARGINAL_FAILURE, successMinNumber edge under",
    randomIntNumberInclusiveMockResult: 39,
    expectedResult: drawingResult.MARGINAL_FAILURE,
  },
  {
    name: "Test of isSuccess, return MARGINAL_SUCCESS, equal successMinNumber",
    randomIntNumberInclusiveMockResult: 40,
    expectedResult: drawingResult.MARGINAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return MARGINAL_SUCCESS, successMinNumber edge over",
    randomIntNumberInclusiveMockResult: 41,
    expectedResult: drawingResult.MARGINAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return MARGINAL_SUCCESS",
    randomIntNumberInclusiveMockResult: 55,
    expectedResult: drawingResult.MARGINAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return MARGINAL_SUCCESS, marginalSuccessLimit edge under",
    randomIntNumberInclusiveMockResult: 59,
    expectedResult: drawingResult.MARGINAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, equal marginalSuccessLimit",
    randomIntNumberInclusiveMockResult: 60,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, marginalSuccessLimit edge over",
    randomIntNumberInclusiveMockResult: 61,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS",
    randomIntNumberInclusiveMockResult: 80,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return SUCCESS, marginalSuccessLimit edge under",
    randomIntNumberInclusiveMockResult: 89,
    expectedResult: drawingResult.SUCCESS,
  },
  {
    name: "Test of isSuccess, return CRITICAL_SUCCESS, equal marginalSuccessLimit",
    randomIntNumberInclusiveMockResult: 90,
    expectedResult: drawingResult.CRITICAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return CRITICAL_SUCCESS, marginalSuccessLimit edge over",
    randomIntNumberInclusiveMockResult: 91,
    expectedResult: drawingResult.CRITICAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return CRITICAL_SUCCESS",
    randomIntNumberInclusiveMockResult: 95,
    expectedResult: drawingResult.CRITICAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return CRITICAL_SUCCESS, equal maxLimit",
    randomIntNumberInclusiveMockResult: 100,
    expectedResult: drawingResult.CRITICAL_SUCCESS,
  },
  {
    name: "Test of isSuccess, return CRITICAL_SUCCESS, overkill",
    randomIntNumberInclusiveMockResult: 120,
    expectedResult: drawingResult.CRITICAL_SUCCESS,
  },
];
