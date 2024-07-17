import requests

year = 2024
URL = f'https://www.eydap.gr/el/Controls/GeneralControls/SavingsDetails.aspx?DaysSpan=Year&Date=31-12-{year}'
r = requests.get( URL, verify='./eydap.gr.cert' )

print( URL )
print( r.status_code )
print( r.text )
