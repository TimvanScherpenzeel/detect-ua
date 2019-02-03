// Vendor
import { DetectUA } from '../src';

// Data
import { USER_AGENT_STRINGS } from './data';

// Suite
describe('DetectUA', () => {
  it('should instantiate a new instance of DetectUA', () => {
    expect.assertions(1);

    const UA = new DetectUA();

    expect(UA).toBeInstanceOf(DetectUA);
  });

  it('should accept a forced user agent string', () => {
    expect.assertions(1);

    const UA = new DetectUA('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko');

    expect(UA.userAgent).toEqual('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko');
  });

  Object.keys(USER_AGENT_STRINGS).forEach((browser: string) => {
    USER_AGENT_STRINGS[browser].forEach((entry: any) => {
      it('should correctly detect the browser and browser version based on the detected user agent', () => {
        expect.assertions(1);

        const UA = new DetectUA(entry.ua);

        expect(UA.browser).toEqual({
          name: entry.spec.browser.name,
          version: entry.spec.browser.version
            ? entry.spec.browser.version.match(/[^.]*.[^.]*/g, '')[0]
            : '',
        });
      });
    });
  });
});
