// Miscellaneous functions to supplement other logic

// Convert a time in seconds to a string in the format HH:MM:SS
function UTCtoD(utc: number): string {
    let n : Date = new Date(utc*1000);
    let h : string = n.getUTCHours().toString(); 
    let m : string = n.getUTCMinutes().toString();
    let s : string = n.getUTCSeconds().toString();
    
    return n.toLocaleTimeString();
}

export default UTCtoD;