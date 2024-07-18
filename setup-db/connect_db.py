import psycopg2

def connectDB():

    # Establish a DB connection

    conn = psycopg2.connect(
        database="water_reserves",
        user='admin', 
        password='pass5678', 
        host='127.0.0.1', 
        port= '5432'
    )

    return conn
