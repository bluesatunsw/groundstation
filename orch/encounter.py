
"""
Subsystem for generating encounters and transferring them to hardware.
Matt Rossouw (omeh-a)
05/2022
"""
from asyncio import sleep
import json
import time
import serial
import serial.tools.list_ports
import api


BAUDRATE = 115200
port = None
ser = None

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
def build_encounter(norad_id, lat, lng, alt):
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

    radio_pass = None
    time_to_generate = 0
    prev_final_timestamp = None
    port = None
    # Store our list steps in a single array. Each entry contains the time, elevation, and azimuth.
    # {"time" : time, "el" : el, "az" : az}
    steps = []

    # Find the COM port for the motor controller. For now just take
    # the first one found.
    for found in serial.tools.list_ports.comports():
        try:
            port = serial.Serial(found.device, baudrate=BAUDRATE)

        except OSError:
            continue

    if port is None:
        raise OSError("Microcontroller not detected.")

    # Open serial port
    ser = serial.Serial(port, BAUDRATE)

    # Get radio passes from API
    radio_pass = json.dumps(api.get_radiopasses(norad_id, lat, lng, alt))['passes'][0]

    # Update total seconds left
    time_to_generate = radio_pass['duration']

    # Sleep until 10 seconds before the start of the radio pass
    sleep(radio_pass['start'] - time.time() - 10)


    # Main segment for managing the encounter. Takes turns transferring
    # steps to the motor controller and getting new positions from the API;
    # blocking when inactive to avoid throttling the server.

    while time_to_generate > 0:
        # Get next 300 (or however much is left) seconds of positions
        secs = time_to_generate if time_to_generate < 300 else 300
        new_steps = api.get_positions(radio_pass['sat'], radio_pass['start'] + secs)

        new_final = None

        # Ignore all entries from steps with a timestamp later than the final timestamp
        # of the previous encounter.
        if prev_final_timestamp is not None:
            for step in new_steps:
                if step['timestamp'] >= prev_final_timestamp:
                    new_steps.remove(step)
                new_final = step['timestamp']

        # Swap to new set of steps
        steps = new_steps

        # Update final timestamp
        prev_final_timestamp = new_final

        # Subtract time from time_to_generate
        time_to_generate -= secs

        # Asynchronously transfer steps to hardware
        transfer_steps()

# TODO: Implement this and make it asynchronous
async def transfer_steps():
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
        m_string = "!" + str(step["az"]) + "," + str(step["el"]) + \
            "," + str(step["time"]) + "\n"
        ser.write(m_string.encode())
        print(step)

    # Clear buffer, except for very last position.
    last = steps[len(steps) - 1]
    steps = [last]
