import json
from fastapi import APIRouter, WebSocket
from fastapi.responses import HTMLResponse
from llms.prompts.generate import generate_json_conversion_prompt, generate_prompt
from config import OPENAI_API_KEY
from llms.core import MODEL_GPT_4_TURBO_0125, stream_openai_response, transcribe
from starlette import status

router = APIRouter()


@router.get("/")
async def get_status():
    return HTMLResponse(
        content="<h3>Your backend is running correctly. Please open the front-end URL (default is http://localhost:5173) to use sell anything.</h3>"
    )


from pydantic import BaseModel


class MarketplaceListing(BaseModel):
    title: str
    price: float
    condition: str
    category: str
    description: str


@router.websocket("/analyze")
async def analyze_item(websocket: WebSocket):

    # Accept a connection from the client
    await websocket.accept()

    async def send_message(status: str, response: str):
        await websocket.send_json(
            {
                "status": status,
                "response": response,
            }
        )

    # OpenAI setup
    openai_api_key = OPENAI_API_KEY
    if not openai_api_key:
        # TODO: Fix the error here
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise ValueError("OpenAI API key is not set")
    openai_base_url = None

    # Receive the parameters from the client's first message
    params = await websocket.receive_json()

    # Params
    image_data_url = params.get("imageUrl")
    product_description_format = params.get("descriptionFormat")
    product_description_audio_data_url = params.get("descriptionAudio")
    product_description_text = params.get("descriptionText")

    # Transcribe the audio description
    if product_description_format == "audio":
        transcribed_audio = await transcribe(
            product_description_audio_data_url, openai_api_key, openai_base_url
        )
    else:
        transcribed_audio = product_description_text

    print(transcribed_audio)
    await send_message("processing", transcribed_audio)

    async def process_chunk(chunk: str):
        print(chunk, end="", flush=True)
        await send_message("processing", chunk)

    # Generate the listing based on the image and the transcribed audio
    prompt_messages = generate_prompt(
        image_data_url,
        transcribed_audio,
    )
    completion = await stream_openai_response(
        prompt_messages,
        api_key=openai_api_key,
        base_url=openai_base_url,
        callback=lambda x: process_chunk(x),
    )

    # Convert the completion to a JSON object
    completion = await stream_openai_response(
        generate_json_conversion_prompt(completion),
        api_key=openai_api_key,
        base_url=openai_base_url,
        callback=lambda x: process_chunk(x),
        model=MODEL_GPT_4_TURBO_0125,
        use_json_mode=True,
    )

    # Validate with the pydantic model
    listing_json = json.loads(completion)
    MarketplaceListing.model_validate(listing_json, strict=True)

    # TODO: If validation fails, retry JSON conversion

    await send_message("success", listing_json)
