var isSSR = typeof window === 'undefined';
var DetectUA = /** @class */ (function () {
    /**
     * Detect a users browser, browser version and whether it is a mobile-, tablet- or desktop device
     *
     * @param forceUserAgent Force a user agent string (useful for testing)
     */
    function DetectUA(forceUserAgent) {
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
        if (!isSSR &&
            navigator.platform === 'MacIntel' &&
            navigator.maxTouchPoints > 2 &&
            !window.MSStream) {
            this.iOSDevice = 'ipad';
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
                    /nexus\s*[0-6]\s*/i.test(this.userAgent)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isTablet", {
        /**
         * Returns if the device is a tablet device
         */
        get: function () {
            return (
            // Default tablet
            (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
                // iPad
                this.iOSDevice === 'ipad' ||
                // Android
                (this.isAndroidDevice && !/[^-]mobi/i.test(this.userAgent)) ||
                // Nexus tablet
                (!/nexus\s*[0-6]\s*/i.test(this.userAgent) && /nexus\s*[0-9]+/i.test(this.userAgent)));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isDesktop", {
        /**
         * Returns if the device is a desktop device
         */
        get: function () {
            return !this.isMobile && !this.isTablet;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isMacOS", {
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
        get: function () {
            return (/macintosh/i.test(this.userAgent) && {
                version: this.match(1, /mac os x (\d+(\.?_?\d+)+)/i)
                    .replace(/[_\s]/g, '.')
                    .split('.')
                    .map(function (versionNumber) { return versionNumber; })[1],
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isWindows", {
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
        get: function () {
            return (/windows /i.test(this.userAgent) && {
                version: this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i),
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isiOS", {
        /**
         * Returns if the device is an iOS device (and if so which version)
         */
        get: function () {
            return (!!this.iOSDevice && {
                version: this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, '.') ||
                    this.match(1, /version\/(\d+(\.\d+)?)/i),
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "isAndroid", {
        /**
         * Returns if the device is an Android device (and if so which version)
         */
        get: function () {
            return (this.isAndroidDevice && {
                version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DetectUA.prototype, "browser", {
        /**
         * Returns the browser name and version
         */
        get: function () {
            var versionIdentifier = this.match(1, /version\/(\d+(\.\d+)?)/i);
            if (/opera/i.test(this.userAgent)) {
                // Opera
                return {
                    name: 'Opera',
                    version: versionIdentifier || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
                };
            }
            else if (/opr\/|opios/i.test(this.userAgent)) {
                // Opera
                return {
                    name: 'Opera',
                    version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier,
                };
            }
            else if (/SamsungBrowser/i.test(this.userAgent)) {
                // Samsung Browser
                return {
                    name: 'Samsung Internet for Android',
                    version: versionIdentifier || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
                };
            }
            else if (/yabrowser/i.test(this.userAgent)) {
                // Yandex Browser
                return {
                    name: 'Yandex Browser',
                    version: versionIdentifier || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
                };
            }
            else if (/ucbrowser/i.test(this.userAgent)) {
                // UC Browser
                return {
                    name: 'UC Browser',
                    version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
                };
            }
            else if (/msie|trident/i.test(this.userAgent)) {
                // Internet Explorer
                return {
                    name: 'Internet Explorer',
                    version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
                };
            }
            else if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
                // Edge
                return {
                    name: 'Microsoft Edge',
                    version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
                };
            }
            else if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
                // Firefox
                return {
                    name: 'Firefox',
                    version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
                };
            }
            else if (/chromium/i.test(this.userAgent)) {
                // Chromium
                return {
                    name: 'Chromium',
                    version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier,
                };
            }
            else if (/chrome|crios|crmo/i.test(this.userAgent)) {
                // Chrome
                return {
                    name: 'Chrome',
                    version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
                };
            }
            else if (/safari|applewebkit/i.test(this.userAgent)) {
                // Safari
                return {
                    name: 'Safari',
                    version: versionIdentifier,
                };
            }
            else {
                // Everything else
                return {
                    name: this.match(1, /^(.*)\/(.*) /),
                    version: this.match(2, /^(.*)\/(.*) /),
                };
            }
        },
        enumerable: false,
        configurable: true
    });
    return DetectUA;
}());

export { DetectUA };
