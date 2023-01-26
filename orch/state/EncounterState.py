"""
EncounterState.py
    Class defining state related to encounter.
    To use this class import EncounterState from this module.
Matt Rossouw (omeh-a)
01/2023
"""

class _EncounterState(object):
    """
    Encounter state class. See EncounterState.py.
    DO NOT DIRECTLY IMPORT THIS CLASS.
    """
    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.steps = []
        self.step_index = 0

EncounterState = _EncounterState()
