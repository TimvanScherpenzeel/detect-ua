export declare class DetectUA {
    userAgent: string;
    private android;
    private iOS;
    private cache;
    /**
     * Detect a users browser, browser version and wheter it is a mobile-, tablet- or desktop device.
     *
     * @param forceUserAgent Force a user agent string (useful for testing)
     */
    constructor(forceUserAgent?: string);
    /**
     * Match entry based on position found in the user-agent string
     *
     * @param pattern regular expression pattern
     */
    private match;
    /**
     * Returns if the device is a mobile device
     */
    readonly isMobile: boolean | {
        [s: string]: string | number | boolean;
    };
    /**
     * Returns if the device is a tablet device
     */
    readonly isTablet: boolean | {
        [s: string]: string | number | boolean;
    };
    /**
     * Returns if the device is a desktop device
     */
    readonly isDesktop: boolean | {
        [s: string]: string | number | boolean;
    };
    /**
     * Returns if the device is an iOS device
     */
    readonly isiOS: boolean | {
        [s: string]: string | number | boolean;
    };
    /**
     * Returns if the device is an Android device
     */
    readonly isAndroid: boolean | {
        [s: string]: string | number | boolean;
    };
    /**
     * Returns the browser name and version
     */
    readonly browser: true | {
        [s: string]: string | number | boolean;
    };
}
