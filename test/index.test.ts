// Vendor
import { DetectUA } from '../src';

// Suite
describe('DetectUA', () => {
  it('should instantiate a new instance of DetectUA', () => {
    expect.assertions(1);

    const ua = new DetectUA();

    expect(ua).toBeInstanceOf(DetectUA);
  });

  it('should accept a forced user agent string', () => {
    expect.assertions(1);

    const ua = new DetectUA('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko');

    expect(ua.userAgent).toEqual('mozilla/5.0 (windows nt 6.3; trident/7.0; rv:11.0) like gecko');
  });
});
