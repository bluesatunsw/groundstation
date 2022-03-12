from flask import Flask, render_template
import requests
def get_satellite():
    return

def get_visual_passes():
    return

def send_reqs(i_wanna_read):
    #req = print(f'https://api.n2yo.com/rest/v1/satellite/{i_wanna_read}')
    try:
        req_url = f'https://api.n2yo.com/rest/v1/satellite/{i_wanna_read}/&apiKey=89SYPR-D26PHV-PZFC8D-4Q3K'
        print(req_url)
        return requests.get(req_url).json()
    except:
        print("no request came back :[")

def get_whats_up(observer_lat, observer_lng, observer_alt, search_radius, category_id):
    i_wanna_read = f'above/{observer_lat}/{observer_lng}/{observer_alt}/{search_radius}/{category_id}'
    return send_reqs(i_wanna_read)


def get_radiopasses(id, observer_lat, observer_lng, observer_alt, days, min_elevation = 15):
    i_wanna_read = f'radiopasses/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{days}/{min_elevation}'
    return send_reqs(i_wanna_read)
