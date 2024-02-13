from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from llms.prompts.analysis import SYSTEM_PROMPT
from config import OPENAI_API_KEY
from llms.core import stream_openai_response
from openai.types.chat import ChatCompletionMessageParam, ChatCompletionContentPartParam

router = APIRouter()


@router.get("/")
async def get_status():
    return HTMLResponse(
        content="<h3>Your backend is running correctly. Please open the front-end URL (default is http://localhost:5173) to use sell anything.</h3>"
    )


def generate_prompt(image_data_url: str, user_description: str):
    user_content: list[ChatCompletionContentPartParam] = [
        {
            "type": "image_url",
            "image_url": {"url": image_data_url, "detail": "high"},
        },
        {
            "type": "text",
            "text": "Here is a transcribed audio description from the user:"
            + user_description,
        },
    ]

    prompt_messages: list[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": user_content,
        },
    ]

    return prompt_messages


@router.post("/analyze")
async def analyze_item(item: dict[str, str]):

    openai_api_key = OPENAI_API_KEY
    if not openai_api_key:
        raise ValueError("OpenAI API key is not set")

    openai_base_url = None

    image_data_url = "https://images.unsplash.com/photo-1581539250439-c96689b516dd?q=80&w=2586&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    prompt_messages = generate_prompt(
        image_data_url,
        """
I bought this chair for $300, from Eames. I think it could still go for $100 since it's in good condition. 
I'm selling it because I'm moving to a new place and I don't have space for it. 
It's a great chair and I hope someone else can enjoy it as much as I did. 
I think it's a good deal.
""",
    )

    async def process_chunk(chunk: str):
        print(chunk, end="", flush=True)

    await stream_openai_response(
        prompt_messages,
        api_key=openai_api_key,
        base_url=openai_base_url,
        callback=lambda x: process_chunk(x),
    )

    # Placeholder for item analysis logic
    # In a real scenario, you would implement the logic to analyze the item details
    # For now, we will just return a success message with the received item details
    return {
        "status": "success",
        "message": "Item analysis is not implemented yet",
        "item": item,
    }
