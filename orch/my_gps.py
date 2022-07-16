from gps3 import gps3

gps_socket = gps3.GPSDSocket()
data_stream = gps3.DataStream()

gps_socket.connect()
gps_socket.watch()