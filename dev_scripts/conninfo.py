file = open( 'resources/.env' )
text = file.read()
lines = list( filter( lambda row: len( row.split( '=' ) ) > 1, text.split( '\n' ) ) )
pairs = list( map( lambda line: line.split( '=' ), lines ) )
env = { p[ 0 ]: p[ 1 ].replace( "'", "" ).strip() for p in pairs }
# print( env ) # {'DB_HOST': '127.0.0.1', 'DB_PORT': '5432', 'DB_NAME': 'water_reserves', 'DB_USER': 'some-user', 'DB_PASSWORD': 'some-pass'

conninfo = f"user={env['DB_USER']} password={env['DB_PASSWORD']} host={env['DB_HOST']} port={env['DB_PORT']} dbname={env['DB_NAME']}"
