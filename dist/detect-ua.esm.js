var DetectUA = /** @class */ (function () {
    /**
     * Detect a users browser, browser version and wheter it is a mobile-, tablet- or desktop device.
     *
     * @param forceUserAgent Force a user agent string (useful for testing)
     */
    function DetectUA(forceUserAgent) {
        // Internal cache, prevents from doing the same computations twice
        this.cache = new Map();
        this.userAgent = forceUserAgent
            ? forceUserAgent
            : window && window.navigator
                ? window.navigator.userAgent
                : '';
        this.android = !/like android/i.test(this.userAgent) && /android/i.test(this.userAgent);
        this.iOS = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase();
        // Workaround for ipadOS
        // SEE: https://github.com/lancedikson/bowser/issues/329
        // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
        if (navigator.platform === 'MacIntel' &&
            navigator.maxTouchPoints > 2 &&
            !window.MSStream) {
            this.iOS = 'ipad';
        }
    }
    /**
     * Match entry based on position found in the user-agent string
     *
     * @param pattern regular expression pattern
     */
    DetectUA.prototype.match = function (position, pattern) {
        var match = this.userAgent.match(pattern);
        return (match && match.length > 1 && match[position]) || '';
    };
    Object.defineProperty(DetectUA.prototype, "isMobile", {
        /**
         * Returns if the device is a mobile device
         */
        get: function () {
            var cached = this.cache.get('isMobile');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (
                // Default mobile
                !this.isTablet &&
                    (/[^-]mobi/i.test(this.userAgent) ||
                        // iPhone / iPod
                        this.iOS === 'iphone' ||
                        this.iOS === 'ipod' ||
                        // Android
                        this.android ||
                        // Nexus mobile
                        /nexus\s*[0-6]\s*/i.test(this.userAgent))) {
                    this.cache.set('isMobile', true);
                    return true;
                }
                this.cache.set('isMobile', false);
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isTablet", {
        /**
         * Returns if the device is a tablet device
         */
        get: function () {
            var cached = this.cache.get('isTablet');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (
                // Default tablet
                (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
                    // iPad
                    this.iOS === 'ipad' ||
                    // Android
                    (this.android && !/[^-]mobi/i.test(this.userAgent)) ||
                    // Nexus tablet
                    (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent))) {
                    this.cache.set('isTablet', true);
                    return true;
                }
                this.cache.set('isTablet', false);
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isDesktop", {
        /**
         * Returns if the device is a desktop device
         */
        get: function () {
            var cached = this.cache.get('isDesktop');
            if (cached !== undefined) {
                return cached;
            }
            else {
                var result = !this.isMobile && !this.isTablet;
                this.cache.set('isDesktop', result);
                return result;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isMacOS", {
        /**
         * Returns if the device is running MacOS (and if so which version)
         */
        get: function () {
            var cached = this.cache.get('isMacOS');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (/macintosh/i.test(this.userAgent)) {
                    var getMacOSVersionName = function (version) {
                        var v = version
                            .split('.')
                            .splice(0, 2)
                            .map(function (s) { return parseInt(s, 10) || 0; });
                        v.push(0);
                        if (v[0] !== 10) {
                            return '';
                        }
                        switch (v[1]) {
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
                    var result = {
                        name: 'MacOS',
                        version: getMacOSVersionName(this.match(1, /mac os x (\d+(\.?_?\d+)+)/i).replace(/[_\s]/g, '.')),
                    };
                    return result;
                }
                this.cache.set('isMacOS', false);
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isWindows", {
        /**
         * Returns if the device is running Windows (and if so which version)
         */
        get: function () {
            var cached = this.cache.get('isMacOS');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (/windows /i.test(this.userAgent)) {
                    var getWindowsVersionName = function (version) {
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
                    var result = {
                        name: 'Windows',
                        version: getWindowsVersionName(this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i)),
                    };
                    this.cache.set('isWindows', result);
                    return result;
                }
                this.cache.set('isWindows', false);
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isiOS", {
        /**
         * Returns if the device is an iOS device (and if so which version)
         */
        get: function () {
            var cached = this.cache.get('isiOS');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (this.iOS) {
                    var result = {
                        name: 'iOS',
                        version: this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.') ||
                            this.match(1, /version\/(\d+(\.\d+)?)/i),
                    };
                    this.cache.set('iOS', result);
                    return result;
                }
                else {
                    this.cache.set('iOS', false);
                    return false;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isAndroid", {
        /**
         * Returns if the device is an Android device (and if so which version)
         */
        get: function () {
            var cached = this.cache.get('isAndroid');
            if (cached !== undefined) {
                return cached;
            }
            else {
                if (this.android) {
                    var result = {
                        name: 'Android',
                        version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
                    };
                    this.cache.set('Android', result);
                    return result;
                }
                else {
                    return false;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "browser", {
        /**
         * Returns the browser name and version
         */
        get: function () {
            var cached = this.cache.get('browser');
            if (cached !== undefined) {
                return cached;
            }
            else {
                var versionIdentifier = this.match(1, /version\/(\d+(\.\d+)?)/i);
                var result = void 0;
                if (/opera/i.test(this.userAgent)) {
                    // Opera
                    result = {
                        name: 'Opera',
                        version: versionIdentifier || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
                    };
                }
                else if (/opr\/|opios/i.test(this.userAgent)) {
                    // Opera
                    result = {
                        name: 'Opera',
                        version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
                    };
                }
                else if (/SamsungBrowser/i.test(this.userAgent)) {
                    // Samsung Browser
                    result = {
                        name: 'Samsung Internet for Android',
                        version: versionIdentifier || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
                    };
                }
                else if (/yabrowser/i.test(this.userAgent)) {
                    // Yandex Browser
                    result = {
                        name: 'Yandex Browser',
                        version: versionIdentifier || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
                    };
                }
                else if (/ucbrowser/i.test(this.userAgent)) {
                    // UC Browser
                    result = {
                        name: 'UC Browser',
                        version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
                    };
                }
                else if (/msie|trident/i.test(this.userAgent)) {
                    // Internet Explorer
                    result = {
                        name: 'Internet Explorer',
                        version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
                    };
                }
                else if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
                    // Edge
                    result = {
                        name: 'Microsoft Edge',
                        version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
                    };
                }
                else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
                    // Firefox
                    result = {
                        name: 'Firefox',
                        version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
                    };
                }
                else if (/chromium/i.test(this.userAgent)) {
                    // Chromium
                    result = {
                        name: 'Chromium',
                        version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
                    };
                }
                else if (/chrome|crios|crmo/i.test(this.userAgent)) {
                    // Chrome
                    result = {
                        name: 'Chrome',
                        version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
                    };
                }
                else if (/safari|applewebkit/i.test(this.userAgent)) {
                    // Safari
                    result = {
                        name: 'Safari',
                        version: versionIdentifier,
                    };
                }
                else {
                    // Everything else
                    result = {
                        name: this.match(1, /^(.*)\/(.*) /),
                        version: this.match(2, /^(.*)\/(.*) /),
                    };
                }
                this.cache.set('browser', result);
                return result;
            }
        },
        enumerable: true,
        configurable: true
    });
    return DetectUA;
}());

export { DetectUA };
