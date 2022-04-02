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
        raise OSError("No GPS module found!")

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
    if 'v' in data: # 'v' indicates no acquisition
        return False

    return True


def interpret_gps_string(gps):
    '''
    Convert strings from the GPS module into tuples
    consisting of geographic position, latitude, long
    -itude and time.

    Returns dictionary:
    {
        latitude : string
        lat_cardinality : string
        longitude : string
        lon_cardinality : string
        valid : bool
    }

    Valid input is of the form:
    $--GLL,lll.ll,a,yyyyy.yy,a,hhmmss.ss,A
    llll.ll = Latitude of position
    a = N or S
    yyyyy.yy = Longitude of position
    a = E or W
    hhmmss.ss = UTC of position
    A = status: A = valid data
    '''

    # Only look at strings containing latitude/longitude
    if gps.strip().startswith("$GPGLL"):
        lat = gps[7:12]
        lat_cardinality = gps[14]
        long = gps[16:23]
        lon_cardinality = gps[25]
        valid = gps[len(gps+1)] == "A"
        return {
            "latitude" : lat,
            "lat_cardinality" : lat_cardinality,
            "longitude" : long,
            "lon_cardinality" : lon_cardinality,
            "valid" : valid,
        }

    return None
