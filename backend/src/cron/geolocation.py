from datetime import datetime

from src.queries.interruptions import InterruptionsPoolQueryFactory
from src.settings import get_settings

from src.geography.MunicipalitiesHandler import MunicipalitiesHandler
from src.geography.GeolocationHandler import GeolocationHandler

async def geolocation_cron_job() -> None:

    now: datetime = datetime.now()
    print( now, "geolocation cron job" )

    municipalitiesHandler = MunicipalitiesHandler()

    settings = get_settings()
    pending_entries = settings.status.geolocation.pending_entries[ : ]

    if not len( pending_entries ):
        print( "No geolocation required." )
        return

    for entry in pending_entries:

        interruption = {
            "id": entry[ 0 ],
            "date": entry[ 1 ],
            "area": entry[ 2 ],
            "intersection": entry[ 3 ]
        }

        print( 'geolocation:', interruption )

        saveEnabled = False

        geolocationHandler = GeolocationHandler( interruption )
        result = geolocationHandler.result

        if not result:
            interruption[ 'geo_failed' ] = True
            saveEnabled = True

        else:
            if result.get( 'error' ):
                print( result[ 'error' ] )

            else:
                interruption[ 'geo_url' ] = result[ 'url' ]
                interruption[ 'geo_descr' ] = result[ 'descr' ]
                interruption[ 'lat' ] = result[ 'lat' ]
                interruption[ 'lon' ] = result[ 'lon' ]

                name_el = municipalitiesHandler.findByPoint( result[ 'lat' ], result[ 'lon' ] )
                if name_el:
                    # Caution: settings...municipalities, 
                    # not a ist of DICTIONARIES but list of OBJECTS
                    # no syntax municipality[ 'id' ] but municipality.id
                    for municipality in settings.status.interruptions.municipalities:
                        if name_el == municipality.name_el:
                            interruption[ 'municipality_id' ] = municipality.id
                            break
                saveEnabled = True

        # store in DB

        if saveEnabled:
            print( "Updating data..." )
            query_handler = InterruptionsPoolQueryFactory().handler
            query_handler.maker.update_pending( interruption )
            await query_handler.run_query()
            settings.status.geolocation.pending_entries = settings.status.geolocation.pending_entries[ 1: ]

    # update status

    print( "Updating status..." )
    await settings.status.geolocation.update()

