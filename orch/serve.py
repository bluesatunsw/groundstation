from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from json import dumps
#.\Scripts\activate   
import api as apis

app = Flask(__name__)
CORS(app)

all_req_string = {'whats_up': ['observer_lat', 'observer_lng', 'observer_alt', 'search_radius', 'category_id'],
'get_radiopasses:': ['id', 'observer_lat', 'observer_lng', 'observer_alt', 'days', 'min_elevation']}

@app.route('/whats_up')
def whats_up_request():
    try:
        lat_req = request.args.get('observer_lat')
        long_req = request.args.get('observer_lng')
        search_req = request.args.get('search_radius')
        alt_req = request.args.get('observer_alt')
        catid_req = request.args.get('category_id')
        api_input = apis.get_whats_up(lat_req, long_req, alt_req, search_req, catid_req)
        return jsonify(api_input)
    except Exception as e:
        error = f"oops! {e}"
        return jsonify(error)

@app.route('/radiopasses')
def radiopass_request():
    try:
        id_req = request.args.get('id')
        lat_req = request.args.get('observer_lat')
        long_req = request.args.get('observer_lng')
        alt_req = request.args.get('observer_alt')
        days_req = request.args.get('days')
        m_ele_req = request.args.get('min_elevation')
        api_input = apis.get_radiopasses(id_req, lat_req, long_req, alt_req, days_req, m_ele_req)
        return jsonify(api_input)
    except Exception as e:
        error = f"oops! {e}"
        return jsonify(error)


def defaultHandler(err):
    response = err.get_response()
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response


app.config['TRAP_HTTP_EXCEPTIONS'] = True
app.register_error_handler(Exception, defaultHandler)

if __name__ == '__main__':
    app.run(debug=True, port=4999)

'''
@app.route('/testin/<string:name>')
def t1(name):
    return render_template("index.html")
#from distutils.log import debug
@app.route('/')
def index():
    lat_req = request.args.get('latitude')
    long_req = request.args.get('longitude')
    api_input = apis.whats_up(1,long_req, lat_req ,4,5)
    print(lat_req)
    return jsonify(api_input)

@app.route('/testin/<string:name>')
def t1(name):
    return render_template("index.html")

#'''