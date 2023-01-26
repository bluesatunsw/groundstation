# state

This directory contains modules encapsulating all state which needs to be shared with the frontend.

Each module is implemented with a variable wrapping around a single instance of the class. *Never call the class directly to make a new copy or state will degenerate.*