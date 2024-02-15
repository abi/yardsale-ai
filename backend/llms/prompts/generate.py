from openai.types.chat import ChatCompletionMessageParam, ChatCompletionContentPartParam
from llms.prompts.analysis import SYSTEM_PROMPT


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


def generate_json_conversion_prompt(text: str):
    prompt_messages: list[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": """
Convert the following text to a structred JSON format.

The JSON object has the following structure:
{{
    "title": string,
    "price": float,
    "condition": string,
    "category": string,
    "description": string
}}

Here is the text to convert:
"""
            + text,
        },
    ]

    return prompt_messages
