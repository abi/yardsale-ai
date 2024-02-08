from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from config import OPENAI_API_KEY
from llms.core import stream_openai_response
from openai.types.chat import ChatCompletionMessageParam

router = APIRouter()


@router.get("/")
async def get_status():
    openai_api_key = OPENAI_API_KEY
    if not openai_api_key:
        raise ValueError("OpenAI API key is not set")

    openai_base_url = None

    prompt_messages: list[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": "Welcome to the Sell Anything app. What would you like to sell today?",
        }
    ]

    async def process_chunk(chunk: str):
        # print(chunk)
        pass

    completion = await stream_openai_response(
        prompt_messages,
        api_key=openai_api_key,
        base_url=openai_base_url,
        callback=lambda x: process_chunk(x),
    )

    print(completion)

    return HTMLResponse(
        content="<h3>Your backend is running correctly. Please open the front-end URL (default is http://localhost:5173) to use sell anything.</h3>"
    )
