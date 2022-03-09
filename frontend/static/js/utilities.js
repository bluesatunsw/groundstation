"use strict";
// Return the user location
function getPosition(options) {
    return new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(processPosition, processPositionError, options);
            // Format and return position
            function processPosition(position) {
                var _a;
                const data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    altitude: (_a = position.coords.altitude) !== null && _a !== void 0 ? _a : 0
                };
                resolve(data);
            }
            // Format and return error
            function processPositionError(error) {
                const data = {
                    error: error.code,
                    errorMessage: error.message
                };
                reject(data);
            }
        }
        else {
            // Browser does not support Geolocation
            const data = {
                error: 0,
                errorMessage: "Geolocation not supported"
            };
            reject(data);
        }
    });
}
