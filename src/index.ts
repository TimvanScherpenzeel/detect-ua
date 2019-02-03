export class DetectUA {
  public userAgent: string;

  private cache: Map<string, boolean | { [s: string]: boolean | string | number }>;

  constructor(forceUserAgent?: string) {
    this.userAgent = forceUserAgent
      ? forceUserAgent
      : window && window.navigator
      ? window.navigator.userAgent
      : '';

    this.cache = new Map();
  }

  private getFirstMatch(pattern: RegExp) {
    const match = this.userAgent.match(pattern);
    return (match && match.length > 1 && match[1]) || '';
  }

  private getSecondMatch(pattern: RegExp) {
    const match = this.userAgent.match(pattern);
    return (match && match.length > 1 && match[2]) || '';
  }

  get isMobile() {
    const cached = this.cache.get('isMobile');

    if (cached) {
      return cached;
    } else {
      if (
        // Default mobile
        (!this.isTablet && /[^-]mobi/i.test(this.userAgent)) ||
        // iPhone / iPad
        (this.getFirstMatch(/(ipod|iphone)/i).toLowerCase() === 'iphone' || 'ipod') ||
        // Android
        ((!/like android/i.test(this.userAgent) && /android/i.test(this.userAgent)) ||
          // Nexus mobile
          /nexus\s*[0-6]\s*/i.test(this.userAgent))
      ) {
        this.cache.set('isMobile', true);

        return true;
      }

      this.cache.set('isMobile', false);

      return false;
    }
  }

  get isTablet() {
    const cached = this.cache.get('isTablet');

    if (cached) {
      return cached;
    } else {
      if (
        // Default tablet
        (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
        // iPad
        this.getFirstMatch(/ipad/i).toLowerCase() === 'ipad' ||
        // Android
        ((!/like android/i.test(this.userAgent) && !/[^-]mobi/i.test(this.userAgent)) ||
          // Nexus tablet
          (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent)))
      ) {
        this.cache.set('isTablet', true);

        return true;
      }

      this.cache.set('isTablet', false);

      return false;
    }
  }

  get isDesktop() {
    const cached = this.cache.get('isDesktop');

    if (cached) {
      return cached;
    } else {
      const result = !this.isMobile && !this.isTablet;
      this.cache.set('isDesktop', result);

      return result;
    }
  }

  get browser() {
    const cached = this.cache.get('browser');

    if (cached) {
      return cached;
    } else {
      const versionIdentifier = this.getFirstMatch(/version\/(\d+(\.\d+)?)/i);
      let result;

      if (/opera/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version:
            versionIdentifier || this.getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/opr\/|opios/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version: this.getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/SamsungBrowser/i.test(this.userAgent)) {
        // Samsung Browser
        result = {
          name: 'Samsung Internet for Android',
          version:
            versionIdentifier || this.getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/yabrowser/i.test(this.userAgent)) {
        // Yandex Browser
        result = {
          name: 'Yandex Browser',
          version: versionIdentifier || this.getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/ucbrowser/i.test(this.userAgent)) {
        // UC Browser
        result = {
          name: 'UC Browser',
          version: this.getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i),
        };
      } else if (/msie|trident/i.test(this.userAgent)) {
        // Internet Explorer
        result = {
          name: 'Internet Explorer',
          version: this.getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i),
        };
      } else if (/edg([ea]|ios)/i.test(this.userAgent)) {
        // Edge
        result = {
          name: 'Microsoft Edge',
          version: this.getSecondMatch(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),
        };
      } else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
        // Firefox
        result = {
          name: 'Firefox',
          version: this.getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
        };
      } else if (/chromium/i.test(this.userAgent)) {
        // Chromium
        result = {
          name: 'Chromium',
          version: this.getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/chrome|crios|crmo/i.test(this.userAgent)) {
        // Chrome
        result = {
          name: 'Chrome',
          version: this.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
        };
      } else if (/safari|applewebkit/i.test(this.userAgent)) {
        // Safari
        result = {
          name: 'Safari',
          version: versionIdentifier,
        };
      } else {
        // Everything else
        result = {
          name: this.getFirstMatch(/^(.*)\/(.*) /),
          version: this.getSecondMatch(/^(.*)\/(.*) /),
        };
      }

      this.cache.set('browser', result);

      return result;
    }
  }
}
