import { TestModule } from './test.module';

describe('TestModule', () => {
  let testModule: TestModule;

  beforeEach(() => {
    testModule = new TestModule();
  });

  it('should create an instance', () => {
    expect(testModule).toBeTruthy();
  });
});
