import base64
from typing import Awaitable, Callable, List
from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionMessageParam, ChatCompletionChunk
import httpx
from io import BytesIO

MODEL_GPT_4_VISION = "gpt-4-vision-preview"
MODEL_GPT_4_TURBO_0125 = "gpt-4-0125-preview"


async def stream_openai_response(
    messages: List[ChatCompletionMessageParam],
    api_key: str,
    base_url: str | None,
    callback: Callable[[str], Awaitable[None]],
    model: str = MODEL_GPT_4_VISION,
    use_json_mode: bool = False,
) -> str:
    client = AsyncOpenAI(api_key=api_key, base_url=base_url)

    # Base parameters
    params = {"model": model, "messages": messages, "stream": True, "timeout": 600}

    # Add json mode params if needed
    if use_json_mode and model != MODEL_GPT_4_VISION:
        params["response_format"] = {"type": "json_object"}  # type: ignore

    # Add 'max_tokens' only if the model is a GPT4 vision model
    if model == MODEL_GPT_4_VISION:
        params["max_tokens"] = 4096
        params["temperature"] = 0

    stream = await client.chat.completions.create(**params)  # type: ignore
    full_response = ""
    async for chunk in stream:  # type: ignore
        assert isinstance(chunk, ChatCompletionChunk)
        content = chunk.choices[0].delta.content or ""
        full_response += content
        await callback(content)

    await client.close()

    return full_response


async def transcribe(
    audio_url: str,
    api_key: str,
    base_url: str | None,
) -> str:

    # Check if the URL is a base64 string
    if audio_url.startswith("data:"):
        # Extract the base64 encoded data
        base64_data = audio_url.split(",")[1]
        audio_data = base64.b64decode(base64_data)
        filename = "transcription.m4a"
    else:
        # Fetch the audio file from a regular URL
        async with httpx.AsyncClient() as client:
            response = await client.get(audio_url)
            audio_data = response.content
            filename = audio_url.split("/")[-1]

    # Convert bytes to a file-like object
    audio_file = BytesIO(audio_data)

    openai_client = AsyncOpenAI(api_key=api_key, base_url=base_url)
    transcribed_audio = await openai_client.audio.transcriptions.create(
        model="whisper-1", file=(filename, audio_file)
    )
    return transcribed_audio.text
