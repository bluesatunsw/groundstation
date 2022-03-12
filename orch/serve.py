"""
The backend server used by all modules to communicate.
"""
from json import dumps
from flask import Flask, request, jsonify
from flask_cors import CORS
import api as apis

app = Flask(__name__)
CORS(app)


@app.route('/whats_up')
def whats_up_request():
    """
    An internal endpoint that resolves to the N2YO What's up? API.
    """
    lat_req = request.args.get('observer_lat')
    long_req = request.args.get('observer_lng')
    search_req = request.args.get('search_radius')
    alt_req = request.args.get('observer_alt')
    catid_req = request.args.get('category_id')
    api_input = apis.get_whats_up(
        lat_req, long_req, alt_req, search_req, catid_req)
    return jsonify(api_input)


@app.route('/radiopasses')
def radiopass_request():
    """
    An internal endpoint that resolves to the N2YO Get radio passes API.
    """
    id_req = request.args.get('id')
    lat_req = request.args.get('observer_lat')
    long_req = request.args.get('observer_lng')
    alt_req = request.args.get('observer_alt')
    days_req = request.args.get('days')
    m_ele_req = request.args.get('min_elevation')
    api_input = apis.get_radiopasses(
        id_req, lat_req, long_req, alt_req, days_req, m_ele_req)
    return jsonify(api_input)


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
