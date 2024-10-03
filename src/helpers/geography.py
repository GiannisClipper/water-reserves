# baseed on: Distance Between Two Geo-Locations in Python
# https://www.askpython.com/python/examples/find-distance-between-two-geo-locations

from math import radians, sin, cos, acos

def distance( point1, point2 ):

    lat1, lon1 = point1
    lat2, lon2 = point2

    lat1 = radians( lat1 )
    lon1 = radians( lon1 )
    lat2 = radians( lat2 )
    lon2 = radians( lon2 )

    dist = 6371.01 * acos( 
        sin( lat1 ) * sin( lat2 ) + 
        cos( lat1 ) * cos( lat2 ) * cos( lon1 - lon2 ) 
    )

    # print("The distance is %.2fkm." % dist)
    return dist