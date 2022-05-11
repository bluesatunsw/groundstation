// Miscellaneous functions to supplement other logic

// Convert a time in seconds to a string in the format HH:MM:SS
function UTCtoD(utc: number): string {
    let n : Date = new Date(utc*1000);
    let h : string = n.getUTCHours().toString(); 
    let m : string = n.getUTCMinutes().toString();
    let s : string = n.getUTCSeconds().toString();

    // Add leading zeros
    if (h.length < 2) { h = "0" + h; }
    if (m.length < 2) { m = "0" + m; }
    if (s.length < 2) { s = "0" + s; }
    
    return `${h}:${m}:${s}`
}

export default UTCtoD;