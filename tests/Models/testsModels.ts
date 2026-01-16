// interface TestCaseMocks {}
export interface TestCase {
  name: string;
  mocks?: any;
  params: any;
  expected: {
    error: string | null;
    result: any | null;
  };
}
