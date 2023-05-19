# rotator-rs

For control of groundstation rotators by the backend, there needs to be a method
to take in commands for movement, and then run these on rotator motors.
Using Hamlib's rotctl utility, generally run as a command line tool, this will 
be an interface for allowing the backend to communicate to a groundstation 
computer which uses rotctl for rotator control
- May be able to change this to use FFI, but currently will use std::Command