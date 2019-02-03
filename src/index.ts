export class DetectUA {
  private matchCache: Map<string, boolean>;
  private userAgent: string;

  constructor(forceUserAgent?: string) {
    this.matchCache = new Map();
    this.userAgent = (forceUserAgent
      ? forceUserAgent
      : window && window.navigator
      ? window.navigator.userAgent
      : ''
    ).toLowerCase();

    console.log(forceUserAgent, this.userAgent);
  }

  private match(entry: string, pattern: RegExp) {
    if (!this.matchCache.get(entry)) {
      this.matchCache.set(entry, pattern.test(this.userAgent));
    }

    return this.matchCache.get(entry);
  }

  get isMobile() {
    return this.match('isMobile', /(iphone|ipod|((?:android)?.*?mobile)|blackberry|nokia)/i);
  }

  get isTablet() {
    return this.match('isTablet', /(ipad|android(?!.*mobile)|tablet)/i);
  }

  get isDesktop() {
    return !this.isMobile && !this.isTablet;
  }

  get isChrome() {
    return this.match('isChrome', /webkit\W.*(chrome|chromium)\W/i);
  }

  get isFirefox() {
    return this.match('isFirefox', /mozilla.*\Wfirefox\W/i);
  }

  get isSafari() {
    return this.match('isSafari', /webkit\W(?!.*chrome).*safari\W/i);
  }

  get isEdge() {
    return this.match('isEdge', /edge/i);
  }

  get isInternetExplorer() {
    return this.match('isInternetExplorer', /msie |trident/i);
  }

  get isOpera() {
    return this.match('opera', /opera.*\Wpresto\W|opr/i);
  }

  get isUCBrowser() {
    return this.match('isUCBrowser', /ucbrowser/i);
  }

  get isSamsungBrowser() {
    return this.match('isSamsungBrowser', /samsungbrowser/i);
  }

  get browserVersion() {
    const version = new RegExp('[. /]*([0-9.]+)').exec(this.userAgent);

    return version ? parseFloat(version[1]) : false;
  }
}
