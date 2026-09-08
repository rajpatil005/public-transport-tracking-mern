import os
import httpx
from dotenv import load_dotenv

load_dotenv()

# Get backend URL with fallback
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
print(f"🔗 Backend URL: {BACKEND_URL}")

async def getAllBuses():
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            url = f"{BACKEND_URL}/api/buses"
            print(f"📡 Fetching buses from: {url}")
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            print(f"✅ Fetched {len(data.get('data', []))} buses")
            return data
    except httpx.TimeoutException:
        print("⏰ Timeout error while fetching buses")
        return {"data": []}
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP error while fetching buses: {e}")
        return {"data": []}
    except Exception as e:
        print(f"❌ Error fetching buses: {e}")
        return {"data": []}