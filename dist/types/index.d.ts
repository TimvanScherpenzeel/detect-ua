export interface IDeviceResult {
    version: string;
}
export interface IBrowserResult {
    name: string;
    version: string;
}
export declare class DetectUA {
    userAgent: string;
    private isAndroidDevice;
    private iOSDevice;
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
    get isMacOS(): IDeviceResult | boolean;
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
