// Functions for making HTTP requests to backend
// Matt Rossouw (omeh-a)
// 05/2022

import { gps_pos } from "../types/hardwareTypes";
import { n2yo_get_radio_passes, n2yo_get_visual_passes, n2yo_positions } from "../types/n2yotypes";

// Function to request the backend for the radio passes of a satellite
export async function getRadioPasses(satid: number, lat: number, long: number,
    alt: number): Promise<n2yo_get_radio_passes> {

    return await fetch(`http://127.0.0.1:4999/radiopasses?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`, {
        method: 'GET',
    }).then(res => res.json())
    .then(res => {return res as n2yo_get_radio_passes})
}

// Function to request the backend for the visual passes of a satellite
export async function getVisualPasses(satid: number, lat: number, long: number,
    alt: number): Promise<n2yo_get_visual_passes> {
    console.log("getVisualPasses");
    return await fetch(`http://127.0.0.1:4999/visualpasses?norad_id=${satid}&observer_lat=${lat}&
    observer_long=${long}&observer_alt=${alt}&days=1`)
    .then(res => res.json())
    .then(res => {return res as n2yo_get_visual_passes})
}


// // Get TLE from backend
// export async function getTLE(norad_id: number): Promise<> {
//     return await fetch(`http://127.0.0.1:4999/gettle?norad_id=${norad_id}`)
//     .then(res => res.json())
//     .then(res => {return res as n2yo_get_visual_passes})
// }

// Get satellite positions from backend
export async function getPositions(satid: number, pos :gps_pos, num_positions: number)
    : Promise<n2yo_positions> {
    return await fetch(`http://127.0.0.1:4999/positions?norad_id=${satid}&observer_lat=${pos.latitude}&
    observer_long=${pos.longitude}&observer_alt=${pos.altitude}&seconds=${num_positions}`)
    .then(res => res.json())
    .then(res => {return res as n2yo_positions})
}