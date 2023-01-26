"""
TargetingState.py
    Class defining state used by the system in the acquisition, selection
    and browsing of potential targets. To use this class import TargetingState from this module.
Matt Rossouw (omeh-a)
01/2023
"""
from ..orch.n2yo import get_positions
from .SystemState import SystemState

class _TargetingState(object):
    """
    Targeting state class. See TargetingState.py.
    DO NOT DIRECTLY IMPORT THIS CLASS.
    """
    def __init__(self):
        self.target = {
            "satid": 0,
            "name": "",
            "ra" : 0,
            "dec" : 0,
            "lat" : 0,
            "lon" : 0
        }

    def new_target(self, id):
        """
        Get new target details from NORAD id.
        """
        loc = SystemState.get_location()
        res = get_positions(id, loc[0], loc[1], loc[2], 1)

        # work out if response was valid. if not, raise exception



TargetingState = _TargetingState()
