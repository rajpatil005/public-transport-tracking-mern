import httpx

BACKEND_URL = "http://localhost:5000"

async def getAllBuses() :
    async with httpx.AsyncClient() as Client:
        response = await Client.get(f"{BACKEND_URL}/api/buses")

        response.raise_for_status()

        return response.json()