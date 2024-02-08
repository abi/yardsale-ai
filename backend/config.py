import os

# Set to True when running in production (on the hosted version)
# Used as a feature flag to enable or disable certain features
IS_PROD = os.environ.get("IS_PROD", False)


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
