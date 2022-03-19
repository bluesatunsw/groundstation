'''
Serial communications to retrieve location from GPS
'''
import serial

BAUDRATE = 115200

def get_gps():
    """
    Retrieve location from GPS
    """
    gps = None
    response = None

    # Search for an open port
    available_ports = serial.tools.list_ports.comports()
    for port in available_ports:
        try:
            gps = serial.Serial(port.device, baudrate=BAUDRATE, timeout=0.5)

        except OSError:
            continue

    # If no port is found, panic
    if gps is None:
        raise "No open ports found!"

    # Open serial port
    ser = serial.Serial(gps, BAUDRATE)

    num_valid = 0

    # Read data from serial port until GPS has acquired for 3 cycles
    while True:
        data = ser.readline()

        # Only extract line indicating acquisition state
        if data.strip().startswith("$GPGRMC"):
            if valid_data(data):
                num_valid += 1
            else:
                num_valid = 0 # If a response is invalid, start again

        # Once signal is acquired, get longitude/latitude
        if data.strip().startswith("GPGLL") and num_valid >= 3:
            response = data
            break
    # Close serial port
    ser.close()

    # Return data
    return interpret_gps_string(response)

def valid_data(data):
    '''
    Inspect the contents of serial data to make sure
    that GPS has been acquired.
    '''
    data = data[7:len(data)]
    if 'v' in data: # 'v' indicates void connection to satellites
        return False

    return True


def interpret_gps_string(gps):
    '''
    Convert strings from the GPS module into tuples
    consisting of
    '''

    # Only look at strings containing latitude/longitude
    if gps.strip().startswith("$GPGLL"):
        # need to find correct format

        return gps

    return " "
