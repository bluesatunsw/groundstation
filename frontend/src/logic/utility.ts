// Miscellaneous functions to supplement other logic

// Convert a time in seconds to a string in the format HH:MM:SS
function UTCtoD(utc: number): string {
    let n : Date = new Date(utc*1000);
    return n.toLocaleTimeString();
}

export default UTCtoD;