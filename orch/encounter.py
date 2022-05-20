"""
Subsystem for generating encounters and transferring them to hardware.
Matt Rossouw (omeh-a)
05/2022
"""

"""
For now we generate encounters by just grabbing the entire list of positions from
the API. Since the API can return at most 300 seconds of positions, we just make multiple
requests to fulfill the full encounter. This is a temporary solution until we can perform
the kinematic analysis of the encounter to generate an exact path. Realistically, going
straight off the API has limited accuracy and is not at all adaptible to track any objects
that aren't already catalogued.

To start we will simply take the list of elevation/azimuth pairs and their timestamps, and
send these straight to hardware. This might be improved by calculating a weighting for each
step to help make a smoother and more accurate interpolation between steps.
"""

import serial
import serial.tools.list_ports

# Store our list steps in a single array. Each entry contains the time, elevation, and azimuth.
# {"time" : time, "el" : el, "az" : az} 
steps = []


def buildEncounter(id, lat, lng, alt):
    """
    Given a NORAD id and observer position, build an encounter.
    We need to put this into another thread to avoid blocking the server though,
    because we can calculate WHEN an encounter is, but only get satellite positions
    from the current moment onwards. 
    
    Subsequently, we can calculate the passes and set
    the starting position at the start of the radio encounter. We then block until 3 seconds
    before the radio encounter begins to call get_positions for the first (up to) 300 seconds.
    This can be packaged up and sent to hardware, before sleeping again until 3 seconds before
    the next window (if it exists). Generally encounters are quite short however, so we shouldn't
    cause too much API spam with this method.
    """
    pass


def transferSteps():
    """
    Send steps to hardware and purge buffer.
    TODO: find a way to distinguish between the motor COM port and 
          the geolocation COM port
    """

    # Find the COM port for the motor controller. For now just take
    # the first one found.
    available_ports = serial.tools.list_ports.comports()
    for port in available_ports:
        try:
            gps = serial.Serial(port.device, baudrate =)