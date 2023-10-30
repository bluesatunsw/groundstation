
// Information from a single pass
interface n2yo_radio_passes {
  startAz: number,
  startAzCompass: string,
  startUTC: number,
  maxAz: number,
  maxAzCompass: string,
  maxEl: number,
  maxUTC: number,
  endAz: number,
  endAzCompass: string,
  endUTC: number
}

interface n2yo_above {
  satid: number,
  satname: string,
  category: string,
  intDesignator: string,
  launchDate: string,
  satlat: number,
  satlng: number,
  satalt: number
}

interface n2yo_get_radio_passes {
  info: {
    satid: number,
    satname: string,
    passescount: number
  },
  passes: n2yo_radio_passes[]
}

interface n2yo_visual_passes {
  startAz: number,
  startAzCompass: string,
  startEl: number,
  startUTC: number,
  maxAz: number,
  maxAzCompass: string,
  maxEl: number,
  maxUTC: number,
  endAz: number,
  endAzCompass: string,
  endEl: number,
  endUTC: number,
  mag: number,
  duration: number
}

interface n2yo_get_visual_passes {
  info: {
    satid: number,
    satname: string,
    transactionscount: number,
    passescount: number
  },
  passes: n2yo_visual_passes[]
}

interface n2yo_whats_up {
  info: {
    category: string,
    transactionscount: number,
    satcount: number
  },
  above: n2yo_above[]
}

interface n2yo_position {
  satlatitude: number,
  satlongitude: number,
  sataltitude: number,
  azimuth: number,
  elevation: number,
  ra: number,
  dec: number,
  timestamp: number
}

interface n2yo_positions {
  info: {
    satid: number,
    satname: string,
    transactioncount: number,
  },
  positions: n2yo_position[]
}


export type {
  n2yo_radio_passes,
  n2yo_above,
  n2yo_get_radio_passes,
  n2yo_visual_passes,
  n2yo_get_visual_passes,
  n2yo_whats_up,
  n2yo_position,
  n2yo_positions
}