// Functions for making HTTP requests to backend
// Matt Rossouw (omeh-a)
// 05/2022

// Function to request the backend for the radio passes of a satellite
export function getRadioPasses(satid: number, lat: number, long: number,
    alt: number): Promise<Response> {

    return fetch(`/api/get_radio_passes?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`)
}

// Function to request the backend for the visual passes of a satellite
export function getVisualPasses(satid: number, lat: number, long: number,
    alt: number): Promise<Response> {
    return fetch(`/api/get_visual_passes?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`)
}


// Get TLE from backend
export function getTLE(norad_id: number): Promise<Response> {
    return fetch(`/api/get_tle?norad_id=${norad_id}`)
}