import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from app.prompts.bus_prompt import bus_prompt

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

model = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    google_api_key=api_key,
    temperature=0
)

parser = StrOutputParser()


chain = (
    bus_prompt
    | model
    | parser
)

async def generateAnswer(question, buses) :

    response = await chain.ainvoke(
        {
            "question": question,
            "buses": buses
        }
    )

    return response