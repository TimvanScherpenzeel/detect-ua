// Vendor
import { DetectUA } from '../src';

// Suite
describe('DetectUA', () => {
  it('should instantiate a new instance of DetectUA', () => {
    expect.assertions(1);

    const ua = new DetectUA();

    console.log(ua);

    expect(ua).toBeInstanceOf(DetectUA);
  });
});
