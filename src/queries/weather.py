from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.helpers.query.QueryHandler import SyncQueryHandler, AsyncQueryHandler

CREATE_TABLE: str = """
    CREATE TABLE weather (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        temperature_2m_mean REAL,
        temperature_2m_min REAL,
        temperature_2m_max REAL,
        precipitation_sum REAL,
        rain_sum REAL,
        snowfall_sum REAL,
        FOREIGN KEY( location_id ) REFERENCES locations( id ),
        UNIQUE( location_id, date )
    );
"""

class WeatherQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( 
            date, location_id, weather_code, 
            temperature_2m_min, temperature_2m_mean, temperature_2m_max, 
            precipitation_sum, rain_sum, snowfall_sum
        ) VALUES '''

        for date, weather_code, \
            temperature_2m_min, temperature_2m_mean, temperature_2m_max, \
            precipitation_sum, rain_sum, snowfall_sum, location_id in data:
            entry = f"(\
                '{date}',{location_id},{weather_code},\
                {temperature_2m_min},{temperature_2m_mean},{temperature_2m_max},\
                {precipitation_sum},{rain_sum},{snowfall_sum}\
            ),"
            query += entry

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query
    
class WeatherOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = WeatherQueryMaker(
            table_name='weather',
        )
        runner = OnceQueryRunner()
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class WeatherPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = WeatherQueryMaker(
            table_name='weather',
        )
        runner = PoolQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
