import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

print("API KEY:", api_key[:10] if api_key else "MISSING")


model = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=api_key,
    temperature=0
)

async def generateAnswer(question, buses) :

    prompt = f"""
You are a bus tracking AI assistant.

IMPORTANT RULES:
1. Answer ONLY from the Available Bus Data below.
2. Never create fake bus numbers, routes, locations, or schedules.
3. Use simple plain text.
4. Do not use Markdown formatting.
5. Do not use ** for bold text.
6. Keep answers short and readable.
7. Use normal line breaks.
8. If information is missing, reply:
   "No matching bus found in current data."

User Question:
{question}

Available Bus Data:
{buses}

Answer:
"""

    response = await model.ainvoke(prompt)

    return response.content[0]["text"]
