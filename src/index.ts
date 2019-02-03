export class DetectUA {
  public userAgent: string;

  // Internal cache, prevents from doing the same computations twice
  private cache: Map<string, boolean | { [s: string]: boolean | string | number }> = new Map();

  /**
   * Detect a users browser, browser version and wheter it is a mobile-, tablet- or desktop device.
   *
   * @param forceUserAgent Force a user agent string (useful for testing)
   */
  constructor(forceUserAgent?: string) {
    this.userAgent = forceUserAgent
      ? forceUserAgent
      : window && window.navigator
      ? window.navigator.userAgent
      : '';
  }

  /**
   * Match the first entry found in the user-agent string
   *
   * @param pattern regular expression pattern
   */
  private firstMatch(pattern: RegExp) {
    const match = this.userAgent.match(pattern);
    return (match && match.length > 1 && match[1]) || '';
  }

  /**
   * Match the second entry found in the user-agent string
   *
   * @param pattern regular expression pattern
   */
  private secondMatch(pattern: RegExp) {
    const match = this.userAgent.match(pattern);
    return (match && match.length > 1 && match[2]) || '';
  }

  /**
   * Returns if the device is a mobile device
   */
  get isMobile() {
    const cached = this.cache.get('isMobile');

    if (cached) {
      return cached;
    } else {
      const iOSDevice = this.firstMatch(/(iphone|ipod)/i).toLowerCase();

      if (
        // Default mobile
        !this.isTablet &&
        (/[^-]mobi/i.test(this.userAgent) ||
          // iPhone / iPod
          (iOSDevice === 'iphone' || iOSDevice === 'ipod') ||
          // Android
          (!/like android/i.test(this.userAgent) && /android/i.test(this.userAgent)) ||
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

  /**
   * Returns if the device is a tablet device
   */
  get isTablet() {
    const cached = this.cache.get('isTablet');

    if (cached) {
      return cached;
    } else {
      const iOSDevice = this.firstMatch(/(ipad)/i).toLowerCase();

      if (
        // Default tablet
        (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
        // iPad
        iOSDevice === 'ipad' ||
        // Android
        (!/like android/i.test(this.userAgent) &&
          /android/i.test(this.userAgent) &&
          !/[^-]mobi/i.test(this.userAgent)) ||
        // Nexus tablet
        (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent))
      ) {
        this.cache.set('isTablet', true);

        return true;
      }

      this.cache.set('isTablet', false);

      return false;
    }
  }

  /**
   * Returns if the device is a desktop device
   */
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

  /**
   * Returns the browser name and version
   */
  get browser() {
    const cached = this.cache.get('browser');

    if (cached) {
      return cached;
    } else {
      const versionIdentifier = this.firstMatch(/version\/(\d+(\.\d+)?)/i);
      let result;

      if (/opera/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version: versionIdentifier || this.firstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/opr\/|opios/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version: this.firstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/SamsungBrowser/i.test(this.userAgent)) {
        // Samsung Browser
        result = {
          name: 'Samsung Internet for Android',
          version: versionIdentifier || this.firstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/yabrowser/i.test(this.userAgent)) {
        // Yandex Browser
        result = {
          name: 'Yandex Browser',
          version: versionIdentifier || this.firstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/ucbrowser/i.test(this.userAgent)) {
        // UC Browser
        result = {
          name: 'UC Browser',
          version: this.firstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i),
        };
      } else if (/msie|trident/i.test(this.userAgent)) {
        // Internet Explorer
        result = {
          name: 'Internet Explorer',
          version: this.firstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i),
        };
      } else if (/edg([ea]|ios)/i.test(this.userAgent)) {
        // Edge
        result = {
          name: 'Microsoft Edge',
          version: this.secondMatch(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),
        };
      } else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
        // Firefox
        result = {
          name: 'Firefox',
          version: this.firstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
        };
      } else if (/chromium/i.test(this.userAgent)) {
        // Chromium
        result = {
          name: 'Chromium',
          version: this.firstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/chrome|crios|crmo/i.test(this.userAgent)) {
        // Chrome
        result = {
          name: 'Chrome',
          version: this.firstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
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
          name: this.firstMatch(/^(.*)\/(.*) /),
          version: this.secondMatch(/^(.*)\/(.*) /),
        };
      }

      this.cache.set('browser', result);

      return result;
    }
  }
}
