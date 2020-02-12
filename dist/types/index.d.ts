export interface IDeviceResult {
    version: string;
}
export interface IBrowserResult {
    name: string;
    version: string;
}
export declare class DetectUA {
    userAgent: string;
    private android;
    private iOS;
    private cache;
    /**
     * Detect a users browser, browser version and whether it is a mobile-, tablet- or desktop device
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
     * Extract MacOS version name from a version number
     */
    private getMacOSVersionName;
    /**
     * Extract Windows version name from a version number
     */
    private getWindowsVersionName;
    /**
     * Returns if the device is a mobile device
     */
    get isMobile(): boolean;
    /**
     * Returns if the device is a tablet device
     */
    get isTablet(): boolean;
    /**
     * Returns if the device is a desktop device
     */
    get isDesktop(): boolean;
    /**
     * Returns if the device is running MacOS (and if so which version)
     */
    get isMacOS(): IDeviceResult | boolean;
    /**
     * Returns if the device is running Windows (and if so which version)
     */
    get isWindows(): IDeviceResult | boolean;
    /**
     * Returns if the device is an iOS device (and if so which version)
     */
    get isiOS(): IDeviceResult | boolean;
    /**
     * Returns if the device is an Android device (and if so which version)
     */
    get isAndroid(): IDeviceResult | boolean;
    /**
     * Returns the browser name and version
     */
    get browser(): IBrowserResult | boolean;
}
