title: str = 'Water reserves'

version: str = '1.0.0'
    
description:str = """
# Platform of water management data
Includes:
* **Current status** of water reserves, drinking water production and weather data
* Selections of **water reserves** data
* Selections of **drinking water production** data
* Selections of **precipitation** and **temperature** data
* Selections of water supply **interruptions**
"""

tag_home: str = '0. Server availability'
tag_status: str = '1. Current status'
tag_savings: str = '2. Water reserves'
tag_production: str = '3. Drinking water production'
tag_weather: str = '4. Weather data'
tag_interruptions: str = '5. Water supply interruptions'

tags_metadata: list[ dict ] = [
    {
        "name": tag_home, 
        "description": "Message about system availability."
    },
    {
        "name": tag_status, 
        "description": "The most recent measurements of water reserves, drinking water production, precipitation and temperatures. As well as evaluated in comparison to the historical data."
    },
    {
        "name": tag_savings, 
        "description": "Selections of water reserves data. Also, reservoirs list."
    },
    {
        "name": tag_production,
        "description": "Selections of drinking water production data. Also, water-treatment plants list."
    },
    {
        "name": tag_weather, 
        "description": "Selections of precipitation and temperature data. Also, measurement locations list."
    },
    {
        "name": tag_interruptions, 
        "description": "Selections of water supply interruptions. Also, municipalities of Attica list."
    }
]
