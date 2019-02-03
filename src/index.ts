export class DetectUA {
  public userAgent: string;

  constructor(forceUserAgent?: string) {
    this.userAgent = forceUserAgent
      ? forceUserAgent
      : window && window.navigator
      ? window.navigator.userAgent
      : '';
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
    const mobile = !this.isTablet && /[^-]mobi/i.test(this.userAgent);

    if (mobile) {
      return mobile;
    } else {
      if (this.getFirstMatch(/(ipod|iphone)/i).toLowerCase() === 'iphone' || 'ipod') {
        // iOS iPhone / iPod
        return true;
      } else if (!/like android/i.test(this.userAgent) && /android/i.test(this.userAgent)) {
        // Android
        return true;
      } else if (/nexus\s*[0-6]\s*/i.test(this.userAgent)) {
        // Nexus mobile
        return true;
      }
    }
  }

  get isTablet() {
    const tablet = /tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent);

    if (tablet) {
      return tablet;
    } else {
      if (this.getFirstMatch(/ipad/i).toLowerCase() === 'ipad') {
        // iOS iPad
        return true;
      } else if (!/like android/i.test(this.userAgent) && !/[^-]mobi/i.test(this.userAgent)) {
        // Android
        return true;
      } else if (
        !/nexus\s*[0-6]\s*/i.test(this.userAgent) &&
        /nexus\s*[0-9]+/i.test(this.userAgent)
      ) {
        // Nexus tablet
        return true;
      }
    }
  }

  get isDesktop() {
    return !this.isMobile && !this.isTablet;
  }

  get browser() {
    const versionIdentifier = this.getFirstMatch(/version\/(\d+(\.\d+)?)/i);

    if (/opera/i.test(this.userAgent)) {
      // Opera
      return {
        isOpera: true,
        name: 'Opera',
        version: versionIdentifier || this.getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/opr\/|opios/i.test(this.userAgent)) {
      // Opera
      return {
        isOpera: true,
        name: 'Opera',
        version: this.getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
      };
    } else if (/SamsungBrowser/i.test(this.userAgent)) {
      // Samsung Browser
      return {
        isSamsungBrowser: true,
        name: 'Samsung Browser',
        version: versionIdentifier || this.getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/yabrowser/i.test(this.userAgent)) {
      // Yandex Browser
      return {
        isYandexBrowser: true,
        name: 'Yandex Browser',
        version: versionIdentifier || this.getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
      };
    } else if (/ucbrowser/i.test(this.userAgent)) {
      // UC Browser
      return {
        isUCBrowser: true,
        name: 'UC Browser',
        version: this.getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i),
      };
    } else if (/msie|trident/i.test(this.userAgent)) {
      // Internet Explorer
      return {
        isInternetExplorer: true,
        name: 'Internet Explorer',
        version: this.getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i),
      };
    } else if (/edg([ea]|ios)/i.test(this.userAgent)) {
      // Edge
      return {
        isEdge: true,
        name: 'Microsoft Edge',
        version: this.getSecondMatch(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),
      };
    } else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
      // Firefox
      return {
        isFirefox: true,
        name: 'Firefox',
        version: this.getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
      };
    } else if (/chromium/i.test(this.userAgent)) {
      // Chromium
      return {
        isChromium: true,
        name: 'Chromium',
        version: this.getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
      };
    } else if (/chrome|crios|crmo/i.test(this.userAgent)) {
      // Chrome
      return {
        isChrome: true,
        name: 'Chrome',
        version: this.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
      };
    } else if (/safari|applewebkit/i.test(this.userAgent)) {
      // Safari
      return {
        isSafari: true,
        name: 'Safari',
        version: versionIdentifier,
      };
    } else {
      // Everything else
      return {
        name: this.getFirstMatch(/^(.*)\/(.*) /),
        version: this.getSecondMatch(/^(.*)\/(.*) /),
      };
    }
  }
}
