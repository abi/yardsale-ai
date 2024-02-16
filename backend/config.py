import os

# Useful for quick testing
SHOULD_MOCK_AI_RESPONSE = bool(os.environ.get("SHOULD_MOCK_AI_RESPONSE", False))

# Set to True when running in production (on the hosted version)
# Used as a feature flag to enable or disable certain features
IS_PROD = os.environ.get("IS_PROD", False)

# OpenAI API key
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Sentry configuration
SENTRY_DSN = os.environ.get("SENTRY_DSN")
