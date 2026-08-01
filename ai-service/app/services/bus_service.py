import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")

async def getAllBuses() :
    async with httpx.AsyncClient() as Client:
        response = await Client.get(f"{BACKEND_URL}/api/buses")

        response.raise_for_status()

        return response.json()