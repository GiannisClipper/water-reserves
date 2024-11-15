import httpx
import re

base_url = 'https://opendata.eydap.gr'

params = { 
    "sdate": "04/2024",
    "edate": "05/2024" 
}

# r = requests.post(url, json=json_data)
# async with httpx.AsyncClient( verify=cert_file ) as client:

filepath = None

with httpx.Client() as client:

    # make request to get csv filename
    url = f'{base_url}/nowater.php'
    print( 'url:', url )
    response = client.post( url, data=params )

    # request failure
    if response.status_code != 200:
        print( f'Error: {response.status_code} {response.content}' )

    # request success
    else:
        # print( f'Success: {response.status_code} {response.text}' )
        print( f'Success: {response.status_code} {response}' )

        # get csv filename
        result = re.search( 'files(.+?)csv', response.text )
        filepath = result.group( 0 )
        print( 'filepath:', filepath )

if filepath:
    with httpx.Client() as client:

        # make request to download csv file
        url = f'{base_url}/{filepath}'
        print( 'url:', url )
        response = client.get( url )
        print( f'Success: {response.status_code} {response.text}' )

        # save the csv file
        file = open( "interruptions.csv", "w" )
        file.write( response.text )
        file.close()
