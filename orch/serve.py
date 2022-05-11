"""
The backend server used by all modules to communicate.
"""
from json import dumps
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import api as apis
import geolocation

app = Flask(__name__)
CORS(app)


@app.route('/whats_up')
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


@app.route('/radiopasses')
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

@app.route('/visualpasses')
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

@app.route('/gettle')
def gettle_request():
    """
    Internal endpoint to retrieve TLE
    """
    norad_id = request.args.get('norad_id', 25544)
    api_result = apis.get_tle(norad_id)
    return return_handler(api_result)

@app.route('/getpositions')
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


@app.route('/position')
def position_request():
    """
    An internal endpoint that returns the GPS position from serial device.
    """
    try:
        api_result = geolocation.get_gps()
        return return_handler(api_result)
    except OSError as err:
        return Response(str(err), status=404, mimetype='application/json')


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


app.config['TRAP_HTTP_EXCEPTIONS'] = True
app.register_error_handler(Exception, default_handler)


if __name__ == '__main__':
    app.run(debug=True, port=4999)
