from typing import Dict, List, Tuple

# Mock data for Indian Cities and their areas with coordinates (Lat, Long)
CITY_DATA: Dict[str, List[Tuple[str, float, float]]] = {
    "Delhi": [
        ("Connaught Place", 28.6315, 77.2167),
        ("Hauz Khas", 28.5494, 77.2001),
        ("Dwarka", 28.5823, 77.0500),
        ("Rohini", 28.7041, 77.1025),
        ("South Ex", 28.5670, 77.2100),
        ("Chandni Chowk", 28.6505, 77.2303),
    ],
    "Mumbai": [
        ("Colaba", 18.9067, 72.8147),
        ("Bandra", 19.0596, 72.8295),
        ("Andheri", 19.1136, 72.8697),
        ("Juhu", 19.1000, 72.8200),
        ("Worli", 19.0178, 72.8172),
        ("Powai", 19.1176, 72.9060),
    ],
    "Bangalore": [
        ("Indiranagar", 12.9784, 77.6408),
        ("Koramangala", 12.9352, 77.6245),
        ("MG Road", 12.9754, 77.6010),
        ("Whitefield", 12.9698, 77.7500),
        ("Electronic City", 12.8399, 77.6770),
        ("HSR Layout", 12.9100, 77.6400),
    ],
    "Chennai": [
        ("Adyar", 13.0012, 80.2565),
        ("T. Nagar", 13.0418, 80.2341),
        ("Mylapore", 13.0333, 80.2667),
        ("Anna Nagar", 13.0850, 80.2101),
        ("Velachery", 12.9792, 80.2184),
        ("Guindy", 13.0067, 80.2206),
    ],
    "Kolkata": [
        ("Park Street", 22.5487, 88.3522),
        ("Salt Lake", 22.5851, 88.4116),
        ("New Town", 22.5833, 88.4667),
        ("Ballygunge", 22.5280, 88.3659),
        ("Behala", 22.4939, 88.3184),
        ("Gariahat", 22.5186, 88.3688),
    ]
}

def calculate_distance(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """Simple Euclidean distance for MVP (scaling as needed). In real app, use Haversine."""
    import math
    return math.sqrt((coord1[0] - coord2[0])**2 + (coord1[1] - coord2[1])**2) * 111.0 # Approx km
