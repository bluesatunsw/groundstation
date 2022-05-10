// Miscellaneous functions to supplement other logic

function UTCtoD(utc: number): string {
    let n : Date = new Date(utc*1000);
    return `${String((n.getHours() + 11)%24).toString()}:${n.getMinutes().toString()}:${n.getSeconds().toString()}`
}

export default UTCtoD;