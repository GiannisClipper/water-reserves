from connect_db import connectDB

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
            lon REAL
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
            date TEXT NOT NULL,
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
            lon REAL
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
            date TEXT NOT NULL,
            quantity INTEGER,
            FOREIGN KEY( factory_id ) REFERENCES factories( id ),
            UNIQUE( factory_id, date )
        );
    '''

    print( f'Create table production' )
    cursor.execute( sql )
    conn.commit()
