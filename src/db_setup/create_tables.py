def create_reservoirs( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists (as well as depended tables)
    cursor.execute( "DROP TABLE IF EXISTS savings" )
    cursor.execute( "DROP TABLE IF EXISTS reservoirs" )

    # Create table
    sql = '''
        CREATE TABLE reservoirs (
            id SERIAL PRIMARY KEY,
            name_el VARCHAR(30) UNIQUE NOT NULL,
            name_en VARCHAR(30) UNIQUE NOT NULL,
            lat REAL,
            lon REAL,
            start VARCHAR(10)
        );
    '''

    print( f'Create table reservoirs' )
    cursor.execute( sql )
    conn.commit()


def create_savings( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists
    cursor.execute( "DROP TABLE IF EXISTS savings" )

    # Create table
    sql = '''
        CREATE TABLE savings (
            id SERIAL PRIMARY KEY,
            reservoir_id SERIAL NOT NULL,
            date DATE NOT NULL,
            quantity INTEGER,
            FOREIGN KEY( reservoir_id ) REFERENCES reservoirs( id ),
            UNIQUE( reservoir_id, date )
        );
    '''

    print( f'Create table savings' )
    cursor.execute( sql )
    conn.commit()


def create_factories( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists (as well as depended tables)
    cursor.execute( "DROP TABLE IF EXISTS production" )
    cursor.execute( "DROP TABLE IF EXISTS factories" )

    # Create table
    sql = '''
        CREATE TABLE factories (
            id SERIAL PRIMARY KEY,
            name_el VARCHAR(30) UNIQUE NOT NULL,
            name_en VARCHAR(30) UNIQUE NOT NULL,
            lat REAL,
            lon REAL,
            start VARCHAR(10)
        );
    '''

    print( f'Create table factories' )
    cursor.execute( sql )
    conn.commit()


def create_production( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists
    cursor.execute( "DROP TABLE IF EXISTS production" )

    # Create table
    sql = '''
        CREATE TABLE production (
            id SERIAL PRIMARY KEY,
            factory_id SERIAL NOT NULL,
            date DATE NOT NULL,
            quantity INTEGER,
            FOREIGN KEY( factory_id ) REFERENCES factories( id ),
            UNIQUE( factory_id, date )
        );
    '''

    print( f'Create table production' )
    cursor.execute( sql )
    conn.commit()


def create_locations( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists (as well as depended tables)
    cursor.execute( "DROP TABLE IF EXISTS weather" )
    cursor.execute( "DROP TABLE IF EXISTS locations" )

    # Create table
    sql = '''
        CREATE TABLE locations (
            id SERIAL PRIMARY KEY,
            name_el VARCHAR(30) UNIQUE NOT NULL,
            name_en VARCHAR(30) UNIQUE NOT NULL,
            lat REAL,
            lon REAL
        );
    '''

    print( f'Create table locations' )
    cursor.execute( sql )
    conn.commit()


def create_weather( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists
    cursor.execute( "DROP TABLE IF EXISTS weather" )

    # Create table
    sql = '''
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
    '''

def create_interruptions( conn ):

    # Create a cursor object
    cursor = conn.cursor()

    # Drop table if already exists
    cursor.execute( "DROP TABLE IF EXISTS interruptions" )

    # Create table
    sql = '''
        CREATE TABLE interruptions (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            area VARCHAR(30) NOT NULL,
            intersection VARCHAR(128) NOT NULL,
            scheduled VARCHAR(30),
            geo_url TEXT,
            geo_descr TEXT,
            lat REAL,
            lon REAL,
            UNIQUE( date, area, intersection )
        );
    '''

    print( f'Create table weather' )
    cursor.execute( sql )
    conn.commit()
