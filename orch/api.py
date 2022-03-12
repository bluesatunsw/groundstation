"""
Functions to interface with the N2YO API.
"""
import requests


def send_reqs(arguments):
    """
    Return result of request to N2YO API using provided arguments.
    """
    api_key = "89SYPR-D26PHV-PZFC8D-4Q3K"
    req_url = f'https://api.n2yo.com/rest/v1/satellite/{arguments}/&apiKey={api_key}'
    req_res = requests.get(req_url)
    return req_res.json()


def get_whats_up(
        observer_lat=33.8688,
        observer_lng=151.2093,
        observer_alt=3,
        search_radius=75,
        category_id=0):
    """
    Set paramters for N2YO What's up? API or use reasonable defaults.
    """
    arguments = f'above/{observer_lat}/{observer_lng}/{observer_alt}/{search_radius}/{category_id}'
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
    arguments = f'radiopasses/{norad_id}/{observer_lat}/{observer_lng}/{observer_alt}/{days}/{min_elevation}'
    return send_reqs(arguments)
