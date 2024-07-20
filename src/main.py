from fastapi import FastAPI

app = FastAPI()

@app.get( '/', description="This is the home endpoint." )
async def home():
    return { "message": "Water-reserves API is up and running..." }