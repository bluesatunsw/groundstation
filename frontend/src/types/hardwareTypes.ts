interface gps_pos {     // note: we encode cardinality by sign. 
    latitude : string   //      negative = south, positive = north
    longitude : string  //      negative = west, positive = east
    altitude : string
    valid : boolean     //     output from hardware bit representing validity. always positive
                        //      for manual input.
  }

interface backend_status {
    ready: boolean
    hardware_rdy: boolean
}

// TEMPORARY.
interface track_status {
    status: string
    curr_step: number
    az: number
    el: number
}

export type {gps_pos, backend_status, track_status};