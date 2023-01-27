"""
SystemState.py
    Class defining system state. Location, tracking connection, etc.
Matt Rossouw (omeh-a)
01/2023
"""

HW_STAT_UNKNOWN = "Unknown"
HW_STAT_READY = "Ready"
HW_STAT_DISCONNECTED = "Disconnected!"
HW_STAT_TRACKING = "Tracking..."

class _SystemState(object):
    """
    System state class. See SystemState.py.
    DO NOT DIRECTLY IMPORT THIS CLASS.
    """
    def __init__(self):
        self.hardware_status = HW_STAT_UNKNOWN
        # default to UNSW EE&T
        self.location = {
            "latitude": "-33.918006",
            "longitude": "151.231303",
            "altitude": "36.72",
        }
        self.motorcomport = "COM1"

    def get_location(self):
        return (self.location["latitude"], self.location["longitude"],\
            self.location["altitude"])

    def set_location(self, lat, long, alt):
        # set location. this is here to interface with both a manual
        # coordinate set from the frontend or geolocation module
        return

    


SystemState = _SystemState()
