This project regards a platform designed and developed to collect, store, analyze, and afterwards to provide and illustrate data concerning the water supply of Athens (water reserves quantities, drinking water production quantities, precipitation and temperature measurements, water supply interruptions). 

__EXTERNAL SOURCES & SERVICES__

The platform is powered by various external data sources and Internet services:

- https://www.eydap.gr/TheCompany/Water/Savings : Daily quantities remaining in each one of the 4 main water reservoirs (data since 1985).
- https://www.eydap.gr/TheCompany/Water/DrinkingWaterProduction : Daily quantities of the drinking water production in each one of the 4 water treatment plants (data since 1996).
- https://open-meteo.com : Daily precipitation and temperature measurements from 8 cities in central Greece (data since 1985).
- https://opendata.eydap.gr/nowater.php : Water supply interruption events (data since 2021).

- https://openstreetmap.org : Online map representations.
- https://geodata.gov.gr/organization/okxe : The boundaries of the greater Athens municipalities as sequences of geographical coordinates (geojson).
- https://nominatim.openstreetmap.com : Geolocation service to identify geographical coordinates from raw text addresses.
- https://geoapify.com : Alternative geolocation service to identify geographical coordinates from raw text addresses.

__DATA ANALYSIS__

The platform performs the following analysis on the collected data:

- __clustering__: K-means algorithm to classify or evaluate the most recent measurements compared to the historical data.  
- __correlation__: Pearson και Spearman coefficients in order to assess a possible correlation between the water reserves and the precipitation measurements.

__IMPLEMENTATION__

The perform has been developed as a distributed system consisting of three subsystems:
- An __SQL database__ (postgres).
- A __backend application__ written in FastAPI (Python framework).
- A __frontend application__ written in NextJS (ReactJS framework).

Specifically the backend application carries out two main operations:
- Updates the datasets on a daily basis, through __schedulers__ running periodically and checking the data sources.
- Provides the collected data, through a __REST API__ servicing third-party applications.

__DEPLOYMENT__

- The __Docker compose__ is used in order for the three subsystems to be containerized and connected between. 
- The platform is deployed on the infrastructure of Harokopio University: htttp://water.ditapps.hua.gr

__INDICATIVE VIEWS__

- Dashboard illustrating the most recent measurements:
https://water.ditapps.hua.gr/status

- Comparison of the Water reserves through the years:
https://water.ditapps.hua.gr/savings?chart_type=area&time_range=1985,2024&time_aggregation=year,avg&reservoir_filter=1,2,3,4

- Map illustration with the distribution of the water supply interruptions:
https://water.ditapps.hua.gr/interruptions?chart_type=map&time_range=2024,2024&time_aggregation=alltime,sum,over-area

- An example request to the REST API:
https://water.ditapps.hua.gr/api/v1/weather?time_range=2025

- The online documentation (swagger-ui) of the REST API:
https://water.ditapps.hua.gr/api/v1/docs