"""
The backend server used by all modules to communicate.
"""
from json import dumps
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import api as apis
import geolocation

# Encounter imports
import logging
import threading
import time

from encounter import build_encounter, encounterLoop

APP = Flask(__name__)
CORS(APP)

encounterThread = None


@APP.route('/whats_up')
def whats_up_request():
    """
    An internal endpoint that resolves to the N2YO What's up? API.
    """
    observer_lat = request.args.get('observer_lat', 33.8688)
    observer_lng = request.args.get('observer_lng', 151.2093)
    observer_alt = request.args.get('observer_alt', 3)
    search_radius = request.args.get('search_radius', 75)
    category_id = request.args.get('category_id', 0)
    api_result = apis.get_whats_up(
        observer_lat, observer_lng, observer_alt, search_radius, category_id)
    return return_handler(api_result)


@APP.route('/radiopasses')
def radiopass_request():
    """
    An internal endpoint that resolves to the N2YO Get radio passes API.
    """
    norad_id = request.args.get('norad_id', 25544)
    observer_lat = request.args.get('observer_lat', 33.8688)
    observer_lng = request.args.get('observer_lng', 151.2093)
    observer_alt = request.args.get('observer_alt', 3)
    days = request.args.get('days', 7)
    min_elevation = request.args.get('min_elevation', 15)
    api_result = apis.get_radiopasses(
        norad_id, observer_lat, observer_lng, observer_alt, days, min_elevation)
    return return_handler(api_result)

@APP.route('/visualpasses')
def visualpass_request():
    """
    An internal endpoint that resolves to the N2YO Get visual passes API.
    """
    norad_id = request.args.get('norad_id', 25544)
    observer_lat = request.args.get('observer_lat', 33.8688)
    observer_lng = request.args.get('observer_lng', 151.2093)
    observer_alt = request.args.get('observer_alt', 3)
    days = request.args.get('days', 7)
    min_visibility = request.args.get('min_visibility', 60)
    api_result = apis.get_visualpasses(
        norad_id, observer_lat, observer_lng, observer_alt, days, min_visibility)
    return return_handler(api_result)

@APP.route('/gettle')
def gettle_request():
    """
    Internal endpoint to retrieve TLE
    """
    norad_id = request.args.get('norad_id', 25544)
    api_result = apis.get_tle(norad_id)
    return return_handler(api_result)

@APP.route('/getpositions')
def get_positions():
    """
    Internal endpoint to get satellite locations from n2yo
    """
    norad_id = request.args.get('norad_id', 25544)
    observer_lat = request.args.get('observer_lat', 33.8688)
    observer_lng = request.args.get('observer_lng', 151.2093)
    observer_alt = request.args.get('observer_alt', 3)
    seconds = request.args.get('seconds', 1)
    api_result = apis.get_positions(norad_id, observer_lat, observer_lng, observer_alt, seconds)
    return return_handler(api_result)


@APP.route('/position')
def position_request():
    """
    An internal endpoint that returns the GPS position from serial device.
    """
    try:
        api_result = geolocation.get_gps()
        return return_handler(api_result)
    except OSError as err:
        return Response(str(err), status=404, mimetype='application/json')

@APP.route('/status')
def getstatus():
    """
    Internal endpoint for polling backend readiness
    """
    try:
        return return_handler(apis.get_status())
    except OSError as err:
        return Response(str(err), status=404, mimetype='application/json')

@APP.route('/start_encounter')
def start_encounter():
    """
    Endpoint to start an encounter and move data to the encounter thread.
    If the encounter and timer thread are running already, terminate and restart
    """
    format = "%(asctime)s: %(message)s"

    logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")
    while True:
        if encounterThread is None:
            logging.info("Starting encounter thread")
            # We set daemon=True to force this thread to exit when the main thread exits.
            encounterThread = threading.Thread(target=build_encounter, args=(), daemon=True)
            encounterThread.start()
            break
        else:
            encounterThread.end()

def return_handler(api_result):
    """
    Processes input and produces error if required.
    """
    try:
        return jsonify(api_result)
    except TypeError:
        return Response(f'{{"Error": "{api_result}"}}', status=404, mimetype='application/json')


def default_handler(err):
    """
    The error handler for Flask exceptions.
    """
    response = err.get_response()
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response


APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, default_handler)


if __name__ == '__main__':
    APP.run(debug=True, port=4999)
