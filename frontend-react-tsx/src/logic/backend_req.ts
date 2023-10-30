// Functions for making HTTP requests to backend
// Matt Rossouw (omeh-a)
// 05/2022

import { gps_pos } from "../../types/hardwareTypes";
import { n2yo_get_radio_passes, n2yo_get_visual_passes, n2yo_positions, n2yo_whats_up } from "../../types/n2yotypes";


// Parameters set by frontend to communicate with backend
let port: number = 4999

export function backend_setPort(p : number) {
    port = p
}


// Function to request the backend for the radio passes of a satellite
export async function getRadioPasses(satid: number, lat: number, long: number,
    alt: number): Promise<n2yo_get_radio_passes> {

    return await fetch(`http://127.0.0.1:${port}/radiopasses?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`, {
        method: 'GET',
    }).then(res => res.json())
        .then(res => { return res as n2yo_get_radio_passes })
}

// Function to request the backend for the visual passes of a satellite
export async function getVisualPasses(satid: number, lat: number, long: number,
    alt: number): Promise<n2yo_get_visual_passes> {
    console.log("getVisualPasses");
    return await fetch(`http://127.0.0.1:${port}/visualpasses?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`)
        .then(res => res.json())
        .then(res => { return res as n2yo_get_visual_passes })
}


// // Get TLE from backend
// export async function getTLE(norad_id: number): Promise<> {
//     return await fetch(`http://127.0.0.1:${port}/gettle?norad_id=${norad_id}`)
//     .then(res => res.json())
//     .then(res => {return res as n2yo_get_visual_passes})
// }

// Get satellite positions from backend
export async function getPositions(satid: number, pos: gps_pos, num_positions: number)
    : Promise<n2yo_positions> { 
    return await fetch(`http://127.0.0.1:${port}/getpositions?norad_id=${satid}&observer_lat=${pos.latitude}&
    observer_long=${pos.longitude}&observer_alt=${pos.altitude}&seconds=${num_positions}`)
        .then(res => res.json())
        .then(res => { return res as n2yo_positions })
}

// Get what's up from backend
export async function getWhatsUp(pos: gps_pos, search_radius: number, cat_id: number)
    : Promise<n2yo_whats_up> {
    return await fetch(`http://127.0.0.1:${port}/whats_up?observer_lat=${pos.latitude}&observer_long=${pos.longitude}&
    observer_alt=${pos.altitude}&search_radius=${search_radius}&category_id=${cat_id}`)
        .then(res => res.json())
        .then(res => { return res as n2yo_whats_up })
}

// Get backend status
export async function getStatus() {
    /*
        return await fetch(`http://127.0.0.1:${port}/status`)
            .then(res => res.json())
            .then(res => {return res as backend_status})
    //*/
    return null
}