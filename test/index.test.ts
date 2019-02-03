// Vendor
import { DetectUA } from '../src';

// Data
import { USER_AGENT_EDGE12, USER_AGENT_EDGE13, USER_AGENT_IE10, USER_AGENT_IE11 } from './data';

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

    expect(UA.userAgent).toEqual('mozilla/5.0 (windows nt 6.3; trident/7.0; rv:11.0) like gecko');
  });

  it('should match IE10 / IE11 user agent with Internet Explorer', () => {
    expect.assertions(16);

    const UA_IE10 = new DetectUA(USER_AGENT_IE10);

    expect(UA_IE10.isInternetExplorer).toEqual(true);
    expect(UA_IE10.isChrome).toBeFalsy();
    expect(UA_IE10.isEdge).toBeFalsy();
    expect(UA_IE10.isFirefox).toBeFalsy();
    expect(UA_IE10.isOpera).toBeFalsy();
    expect(UA_IE10.isSafari).toBeFalsy();
    expect(UA_IE10.isSamsungBrowser).toBeFalsy();
    expect(UA_IE10.isUCBrowser).toBeFalsy();

    const UA_IE11 = new DetectUA(USER_AGENT_IE11);

    expect(UA_IE11.isInternetExplorer).toEqual(true);
    expect(UA_IE11.isChrome).toBeFalsy();
    expect(UA_IE11.isEdge).toBeFalsy();
    expect(UA_IE11.isFirefox).toBeFalsy();
    expect(UA_IE11.isOpera).toBeFalsy();
    expect(UA_IE11.isSafari).toBeFalsy();
    expect(UA_IE11.isSamsungBrowser).toBeFalsy();
    expect(UA_IE11.isUCBrowser).toBeFalsy();
  });

  it('should match EGDE12 / EDGE 13 user agent with Edge', () => {
    expect.assertions(16);

    const UA_EDGE12 = new DetectUA(USER_AGENT_EDGE12);

    expect(UA_EDGE12.isEdge).toEqual(true);
    expect(UA_EDGE12.isChrome).toBeFalsy();
    expect(UA_EDGE12.isFirefox).toBeFalsy();
    expect(UA_EDGE12.isInternetExplorer).toBeFalsy();
    expect(UA_EDGE12.isOpera).toBeFalsy();
    expect(UA_EDGE12.isSafari).toBeFalsy();
    expect(UA_EDGE12.isSamsungBrowser).toBeFalsy();
    expect(UA_EDGE12.isUCBrowser).toBeFalsy();

    const UA_EDGE13 = new DetectUA(USER_AGENT_EDGE13);

    expect(UA_EDGE13.isEdge).toEqual(true);
    expect(UA_EDGE13.isChrome).toBeFalsy();
    expect(UA_EDGE13.isFirefox).toBeFalsy();
    expect(UA_EDGE13.isInternetExplorer).toBeFalsy();
    expect(UA_EDGE13.isOpera).toBeFalsy();
    expect(UA_EDGE13.isSafari).toBeFalsy();
    expect(UA_EDGE13.isSamsungBrowser).toBeFalsy();
    expect(UA_EDGE13.isUCBrowser).toBeFalsy();
  });
});
