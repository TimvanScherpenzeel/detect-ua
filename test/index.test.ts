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

    expect(UA.userAgent).toEqual('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko');
  });

  it('should match IE10 / IE11 user agent with Internet Explorer', () => {
    expect.assertions(2);

    const UA_IE10 = new DetectUA(USER_AGENT_IE10);
    expect(UA_IE10.browser).toEqual({
      isInternetExplorer: true,
      name: 'Internet Explorer',
      version: '10.0',
    });

    const UA_IE11 = new DetectUA(USER_AGENT_IE11);
    expect(UA_IE11.browser).toEqual({
      isInternetExplorer: true,
      name: 'Internet Explorer',
      version: '11.0',
    });
  });

  it('should match EGDE12 / EDGE 13 user agent with Edge', () => {
    expect.assertions(2);

    const UA_EDGE12 = new DetectUA(USER_AGENT_EDGE12);
    expect(UA_EDGE12.browser).toEqual({
      isEdge: true,
      name: 'Microsoft Edge',
      version: '12.0',
    });

    const UA_EDGE13 = new DetectUA(USER_AGENT_EDGE13);
    expect(UA_EDGE13.browser).toEqual({
      isEdge: true,
      name: 'Microsoft Edge',
      version: '13.10586',
    });
  });
});
