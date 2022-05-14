"""
Functions to interface with the N2YO API.
"""
import json
import requests

API_KEY = None

with open('../secrets.json', "rt", 1, "utf-8") as secrets_file:
    try:
        API_KEY = json.load(secrets_file)['n2yo']
    except FileNotFoundError:
        API_KEY = None
        print("WARNING: NO SECRETS FILE SET")

def send_reqs(arguments):
    """
    Return result of request to N2YO API using provided arguments.
    """
    req_url = f'https://api.n2yo.com/rest/v1/satellite/{arguments}/&apiKey={API_KEY}'
    try:
        req_res = requests.get(req_url).json()
        return req_res
    except requests.exceptions.RequestException as exception:
        return exception


def get_whats_up(
        observer_lat=33.8688,
        observer_lng=151.2093,
        observer_alt=3,
        search_radius=75,
        category_id=0):
    """
    Set paramters for N2YO What's up? API or use reasonable defaults.
    """
    arguments = (f'above/{observer_lat}/{observer_lng}/'
                 f'{observer_alt}/{search_radius}/{category_id}')
    return send_reqs(arguments)


def get_radiopasses(
        norad_id=25544,
        observer_lat=33.8688,
        observer_lng=151.2093,
        observer_alt=3,
        days=7,
        min_elevation=15):
    """
    Set paramters for N2YO Get radio passes API or use reasonable defaults.
    """
    arguments = (f'radiopasses/{norad_id}/{observer_lat}/{observer_lng}/'
                 f'{observer_alt}/{days}/{min_elevation}')
    return send_reqs(arguments)


def get_visualpasses(
        norad_id=25544,
        observer_lat=33.8688,
        observer_lng=151.2093,
        observer_alt=3,
        days=7,
        min_visibility=60):
    """
    Set paramters for N2YO Get visual passes API or use reasonable defaults.
    """
    arguments = (f'visualpasses/{norad_id}/{observer_lat}/{observer_lng}/'
                 f'{observer_alt}/{days}/{min_visibility}')
    return send_reqs(arguments)


def get_tle(norad_id=25544):
    """
    Set paramters for N2YO Get TLE API or use reasonable defaults.
    """
    arguments = (f'tle/{norad_id}')
    return send_reqs(arguments)


def get_positions(norad_id=25544,
                  observer_lat=33.8688,
                  observer_lng=151.2093,
                  observer_alt=3,
                  seconds=1):
    """
    Get satellite positions from N2YO API.
    """
    arguments = (
        f'positions/{norad_id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}')
    return send_reqs(arguments)
