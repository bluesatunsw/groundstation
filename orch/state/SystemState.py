"""
SystemState.py
    Class defining system state. Location, tracking connection, etc.
Matt Rossouw (omeh-a)
01/2023
"""

class _SystemState(object):
    """
    System state class. See SystemState.py.
    DO NOT DIRECTLY IMPORT THIS CLASS.
    """
    def __init__(self):
        self.hardware_status = "Unknown"
        # default to UNSW EE&T
        self.location = {
            "latitude": "-33.918006",
            "longitude": "151.231303",
            "altitude": "36.72",
        }
        self.motorcomport = "COM1"

SystemState = _SystemState()
