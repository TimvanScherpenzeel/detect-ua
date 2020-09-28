const isSSR = typeof window === 'undefined';

export interface IDeviceResult {
  version: string;
}

export interface IBrowserResult {
  name: string;
  version: string;
}

export class DetectUA {
  public userAgent: string;

  // Internal variables, prevents multiple lookups
  private isAndroidDevice: boolean;
  private iOSDevice: string;

  /**
   * Detect a users browser, browser version and whether it is a mobile-, tablet- or desktop device
   *
   * @param forceUserAgent Force a user agent string (useful for testing)
   */
  constructor(forceUserAgent?: string) {
    this.userAgent = forceUserAgent
      ? forceUserAgent
      : !isSSR && window.navigator
      ? window.navigator.userAgent
      : '';

    this.isAndroidDevice = !/like android/i.test(this.userAgent) && /android/i.test(this.userAgent);
    this.iOSDevice = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase();

    // Workaround for ipadOS, force detection as tablet
    // SEE: https://github.com/lancedikson/bowser/issues/329
    // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    if (
      !isSSR &&
      navigator.platform === 'MacIntel' &&
      navigator.maxTouchPoints > 2 &&
      !(window as any).MSStream
    ) {
      this.iOSDevice = 'ipad';
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
   * Returns if the device is a mobile device
   */
  get isMobile(): boolean {
    return (
      // Default mobile
      !this.isTablet &&
      (/[^-]mobi/i.test(this.userAgent) ||
        // iPhone / iPod
        this.iOSDevice === 'iphone' ||
        this.iOSDevice === 'ipod' ||
        // Android
        this.isAndroidDevice ||
        // Nexus mobile
        /nexus\s*[0-6]\s*/i.test(this.userAgent))
    );
  }

  /**
   * Returns if the device is a tablet device
   */
  get isTablet(): boolean {
    return (
      // Default tablet
      (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
      // iPad
      this.iOSDevice === 'ipad' ||
      // Android
      (this.isAndroidDevice && !/[^-]mobi/i.test(this.userAgent)) ||
      // Nexus tablet
      (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent))
    );
  }

  /**
   * Returns if the device is a desktop device
   */
  get isDesktop(): boolean {
    return !this.isMobile && !this.isTablet;
  }

  /**
   * Returns if the device is running MacOS (and if so which version)
   *
   * '5' => Leopard'
   * '6' => Snow Leopard'
   * '7' => Lion'
   * '8' => Mountain Lion'
   * '9' => Mavericks'
   * '10' => Yosemite'
   * '11' => El Capitan'
   * '12' => Sierra'
   * '13' => High Sierra'
   * '14' => Mojave'
   * '15' => Catalina'
   */
  get isMacOS(): IDeviceResult | boolean {
    return (
      /macintosh/i.test(this.userAgent) && {
        version: this.match(1, /mac os x (\d+(\.?_?\d+)+)/i)
          .replace(/[_\s]/g, '.')
          .split('.')
          .map((versionNumber: string): string => versionNumber)[1],
      }
    );
  }

  /**
   * Returns if the device is running Windows (and if so which version)
   *
   * 'NT' => 'NT'
   * 'XP' => 'XP'
   * 'NT 5.0' => '2000'
   * 'NT 5.1' => 'XP'
   * 'NT 5.2' => '2003'
   * 'NT 6.0' => 'Vista'
   * 'NT 6.1' => '7'
   * 'NT 6.2' => '8'
   * 'NT 6.3' => '8.1'
   * 'NT 10.0' => '10'
   */
  get isWindows(): IDeviceResult | boolean {
    return (
      /windows /i.test(this.userAgent) && {
        version: this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i),
      }
    );
  }

  /**
   * Returns if the device is an iOS device (and if so which version)
   */
  get isiOS(): IDeviceResult | boolean {
    return (
      !!this.iOSDevice && {
        version:
          this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.') ||
          this.match(1, /version\/(\d+(\.\d+)?)/i),
      }
    );
  }

  /**
   * Returns if the device is an Android device (and if so which version)
   */
  get isAndroid(): IDeviceResult | boolean {
    return (
      this.isAndroidDevice && {
        version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
      }
    );
  }

  /**
   * Returns the browser name and version
   */
  get browser(): IBrowserResult | boolean {
    const versionIdentifier = this.match(1, /version\/(\d+(\.\d+)?)/i);

    if (/opera/i.test(this.userAgent)) {
      // Opera
      return {
        name: 'Opera',
        version: versionIdentifier || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/opr\/|opios/i.test(this.userAgent)) {
      // Opera
      return {
        name: 'Opera',
        version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
      };
    } else if (/SamsungBrowser/i.test(this.userAgent)) {
      // Samsung Browser
      return {
        name: 'Samsung Internet for Android',
        version: versionIdentifier || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/yabrowser/i.test(this.userAgent)) {
      // Yandex Browser
      return {
        name: 'Yandex Browser',
        version: versionIdentifier || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/ucbrowser/i.test(this.userAgent)) {
      // UC Browser
      return {
        name: 'UC Browser',
        version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/msie|trident/i.test(this.userAgent)) {
      // Internet Explorer
      return {
        name: 'Internet Explorer',
        version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
      };
    } else if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
      // Edge
      return {
        name: 'Microsoft Edge',
        version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
      };
    } else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
      // Firefox
      return {
        name: 'Firefox',
        version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
      };
    } else if (/chromium/i.test(this.userAgent)) {
      // Chromium
      return {
        name: 'Chromium',
        version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
      };
    } else if (/chrome|crios|crmo/i.test(this.userAgent)) {
      // Chrome
      return {
        name: 'Chrome',
        version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
      };
    } else if (/safari|applewebkit/i.test(this.userAgent)) {
      // Safari
      return {
        name: 'Safari',
        version: versionIdentifier,
      };
    } else {
      // Everything else
      return {
        name: this.match(1, /^(.*)\/(.*) /),
        version: this.match(2, /^(.*)\/(.*) /),
      };
    }
  }
}
