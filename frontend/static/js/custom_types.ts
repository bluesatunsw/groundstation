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
      transactionscount: number,
      passescount: number
  },
  passes: n2yo_radio_passes[]
}

interface n2yo_whats_up {
  info: {
      category: string,
      transactionscount: number,
      satcount: number
  },
  above: n2yo_above[]
}

export {
  n2yo_radio_passes,
  n2yo_above,
  n2yo_get_radio_passes,
  n2yo_whats_up
}
