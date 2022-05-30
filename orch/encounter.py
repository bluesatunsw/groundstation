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

Note: lots of stuff here is global intentionally to avoid OS induced weirdness with the serial
      port after context changes.
"""

from asyncio import sleep
import json
import time
import serial
import serial.tools.list_ports
import api

# Store our list steps in a single array. Each entry contains the time, elevation, and azimuth.
# {"time" : time, "el" : el, "az" : az} 
steps = []
BAUDRATE = 115200
port = None
ser = None
rp = None
time_to_generate = 0
prev_final_timestamp = None

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
    # Find the COM port for the motor controller. For now just take
    # the first one found.
    available_ports = serial.tools.list_ports.comports()
    for port in available_ports:
        try:
            port = serial.Serial(port.device, baudrate = BAUDRATE)
        
        except OSError:
            continue
    
    if port is None:
        raise OSError("Microcontroller not detected.")
    
    # Open serial port
    ser = serial.Serial(port, BAUDRATE)

    # Get radio passes from API
    rp = json.dumps(api.get_radio_passes(id, lat, lng, alt))['passes'][0]

    # Update total seconds left
    time_to_generate = rp['duration']

    # Sleep until 10 seconds before the start of the radio pass
    sleep(rp['start'] - time.time() - 10)

    encounterLoop()

def encounterLoop():
    """
    Main function for managing the encounter. Takes turns transferring
    steps to the motor controller and getting new positions from the API;
    blocking when inactive to avoid throttling the server.
    """
    while time_to_generate > 0:
        # Get next 300 (or however much is left) seconds of positions
        secs = time_to_generate if time_to_generate < 300 else 300
        s = api.get_positions(rp['sat'], rp['start'] + secs)

        new_final = None

        # Ignore all entries from steps with a timestamp later than the final timestamp
        # of the previous encounter.
        if prev_final_timestamp is not None:
            for step in s:
                if step['timestamp'] < prev_final_timestamp:
                    new_final = step['timestamp']
                    steps.append step
    
        # Update final timestamp
        prev_final_timestamp = new_final

        # Subtract time from time_to_generate
        time_to_generate -= secs

        # Asynchronously transfer steps to hardware
        transferSteps() 

    pass

# TODO: Implement this and make it asynchronous
async def transferSteps():
    """
    Send steps to hardware and purge buffer.
    TODO: find a way to distinguish between the motor COM port and 
          the geolocation COM port
    """
    try:
        # Ensure port is open
        ser = serial.Serial(port, BAUDRATE)
    except OSError:
        print("WARNING: Failed to reopen serial port during an encounter.")
    
    # Transfer steps
    for step in steps:
        # Build string to send to motor controller
        s = "!" + str(step["az"]) + "," + str(step["el"]) + "," + str(step["time"]) + "\n"
        ser.write(s.encode())
    
    # Clear buffer, except for very last position.
    last = steps[len(steps) - 1]
    steps = [last]
    
def terminateEncounter():
    """
    Terminate the current encounter.
    """
    steps = []
    
    # Close serial port
    ser.close()
    ser = None

    # Abandon port for next run
    port = None

    # Forget radio pass
    rp = None

    # Forget time stuff
    prev_final_timestamp = None
    time_to_generate = 0