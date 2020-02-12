export interface IResult {
  name: string;
  version: string;
}

export class DetectUA {
  public userAgent: string;

  // Internal variables, prevents multiple lookups
  private android: boolean;
  private iOS: string;

  // Internal cache, prevents from doing the same computations twice
  private cache: Map<string, any> = new Map();

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

    this.android = !/like android/i.test(this.userAgent) && /android/i.test(this.userAgent);
    this.iOS = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase();

    // Workaround for ipadOS, force detection as tablet
    // SEE: https://github.com/lancedikson/bowser/issues/329
    // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    if (
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 2 &&
      !(window as any).MSStream
    ) {
      this.iOS = 'ipad';
    }
  }

  /**
   * Match entry based on position found in the user-agent string
   *
   * @param pattern regular expression pattern
   */
  private match(position: number, pattern: RegExp): string {
    const match = this.userAgent.match(pattern);
    return (match && match.length > 1 && match[position]) || '';
  }

  /**
   * Extract MacOS version name from version number
   */
  private getMacOSVersionName = (version: string): string => {
    const versionName = version
      .split('.')
      .splice(0, 2)
      .map((versionNumbers: string): number => parseInt(versionNumbers, 10) || 0);

    versionName.push(0);

    if (versionName[0] !== 10) {
      return '';
    }

    switch (versionName[1]) {
      case 5:
        return 'Leopard';
      case 6:
        return 'Snow Leopard';
      case 7:
        return 'Lion';
      case 8:
        return 'Mountain Lion';
      case 9:
        return 'Mavericks';
      case 10:
        return 'Yosemite';
      case 11:
        return 'El Capitan';
      case 12:
        return 'Sierra';
      case 13:
        return 'High Sierra';
      case 14:
        return 'Mojave';
      case 15:
        return 'Catalina';
      default:
        return '';
    }
  };

  /**
   * Extract Windows version name from version number
   */
  private getWindowsVersionName = (version: string): string => {
    switch (version) {
      case 'NT':
        return 'NT';
      case 'XP':
        return 'XP';
      case 'NT 5.0':
        return '2000';
      case 'NT 5.1':
        return 'XP';
      case 'NT 5.2':
        return '2003';
      case 'NT 6.0':
        return 'Vista';
      case 'NT 6.1':
        return '7';
      case 'NT 6.2':
        return '8';
      case 'NT 6.3':
        return '8.1';
      case 'NT 10.0':
        return '10';
      default:
        return '';
    }
  };

  /**
   * Returns if the device is a mobile device
   */
  get isMobile(): boolean {
    const cached = this.cache.get('isMobile');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = // Default mobile
        !this.isTablet &&
        (/[^-]mobi/i.test(this.userAgent) ||
          // iPhone / iPod
          this.iOS === 'iphone' ||
          this.iOS === 'ipod' ||
          // Android
          this.android ||
          // Nexus mobile
          /nexus\s*[0-6]\s*/i.test(this.userAgent));

      this.cache.set('isMobile', result);

      return result;
    }
  }

  /**
   * Returns if the device is a tablet device
   */
  get isTablet(): boolean {
    const cached = this.cache.get('isTablet');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = // Default tablet
        (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
        // iPad
        this.iOS === 'ipad' ||
        // Android
        (this.android && !/[^-]mobi/i.test(this.userAgent)) ||
        // Nexus tablet
        (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent));

      this.cache.set('isTablet', result);

      return result;
    }
  }

  /**
   * Returns if the device is a desktop device
   */
  get isDesktop(): boolean {
    const cached = this.cache.get('isDesktop');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = !this.isMobile && !this.isTablet;

      this.cache.set('isDesktop', result);

      return result;
    }
  }

  /**
   * Returns if the device is running MacOS (and if so which version)
   */
  get isMacOS(): IResult | boolean {
    const cached = this.cache.get('isMacOS');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = /macintosh/i.test(this.userAgent) && {
        name: 'MacOS',
        version: this.getMacOSVersionName(
          this.match(1, /mac os x (\d+(\.?_?\d+)+)/i).replace(/[_\s]/g, '.')
        ),
      };

      this.cache.set('isMacOS', result);

      return result;
    }
  }

  /**
   * Returns if the device is running Windows (and if so which version)
   */
  get isWindows(): IResult | boolean {
    const cached = this.cache.get('isWindows');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = /windows /i.test(this.userAgent) && {
        name: 'Windows',
        version: this.getWindowsVersionName(this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i)),
      };

      this.cache.set('isWindows', result);

      return result;
    }
  }

  /**
   * Returns if the device is an iOS device (and if so which version)
   */
  get isiOS(): IResult | boolean {
    const cached = this.cache.get('isiOS');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = !!this.iOS && {
        name: 'iOS',
        version:
          this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.') ||
          this.match(1, /version\/(\d+(\.\d+)?)/i),
      };

      this.cache.set('isiOS', result);

      return result;
    }
  }

  /**
   * Returns if the device is an Android device (and if so which version)
   */
  get isAndroid(): IResult | boolean {
    const cached = this.cache.get('isAndroid');

    if (cached !== undefined) {
      return cached;
    } else {
      const result = this.android && {
        name: 'Android',
        version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
      };

      this.cache.set('isAndroid', result);

      return result;
    }
  }

  /**
   * Returns the browser name and version
   */
  get browser(): IResult | boolean {
    const cached = this.cache.get('browser');

    if (cached !== undefined) {
      return cached;
    } else {
      const versionIdentifier = this.match(1, /version\/(\d+(\.\d+)?)/i);
      let result;

      if (/opera/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version: versionIdentifier || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/opr\/|opios/i.test(this.userAgent)) {
        // Opera
        result = {
          name: 'Opera',
          version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/SamsungBrowser/i.test(this.userAgent)) {
        // Samsung Browser
        result = {
          name: 'Samsung Internet for Android',
          version: versionIdentifier || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/yabrowser/i.test(this.userAgent)) {
        // Yandex Browser
        result = {
          name: 'Yandex Browser',
          version: versionIdentifier || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/ucbrowser/i.test(this.userAgent)) {
        // UC Browser
        result = {
          name: 'UC Browser',
          version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
        };
      } else if (/msie|trident/i.test(this.userAgent)) {
        // Internet Explorer
        result = {
          name: 'Internet Explorer',
          version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
        };
      } else if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
        // Edge
        result = {
          name: 'Microsoft Edge',
          version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
        };
      } else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
        // Firefox
        result = {
          name: 'Firefox',
          version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
        };
      } else if (/chromium/i.test(this.userAgent)) {
        // Chromium
        result = {
          name: 'Chromium',
          version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
        };
      } else if (/chrome|crios|crmo/i.test(this.userAgent)) {
        // Chrome
        result = {
          name: 'Chrome',
          version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
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
          name: this.match(1, /^(.*)\/(.*) /),
          version: this.match(2, /^(.*)\/(.*) /),
        };
      }

      this.cache.set('browser', result);

      return result;
    }
  }
}
