interface simpleCoordinates {
    latitude: number;
    longitude: number;
    altitude: number;
}

interface simpleError {
    error: number,
    errorMessage: string
}

// Return the user location
function getPosition (options?: PositionOptions): Promise<simpleCoordinates> { // eslint-disable-line no-unused-vars
  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(processPosition, processPositionError, options)

      // Format and return position
      function processPosition (position: GeolocationPosition) {
        const data: simpleCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude ?? 0
        }
        resolve(data)
      }

      // Format and return error
      function processPositionError (error: GeolocationPositionError) {
        const data: simpleError = {
          error: error.code,
          errorMessage: error.message
        }
        reject(data)
      }
    } else {
      // Browser does not support Geolocation
      const data: simpleError = {
        error: 0,
        errorMessage: 'Geolocation not supported'
      }
      reject(data)
    }
  }
  )
}
