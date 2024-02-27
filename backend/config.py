import os

# Useful for quick testing
SHOULD_MOCK_AI_RESPONSE = bool(os.environ.get("SHOULD_MOCK_AI_RESPONSE", False))

# Set to True when running in production (on the hosted version)
# Used as a feature flag to enable or disable certain features
IS_PROD = os.environ.get("IS_PROD", False)

# Database
DB_DSN = os.environ.get("DB_DSN")

# Clerk
CLERK_DOMAIN = os.environ.get("CLERK_DOMAIN")
CLERK_BACKEND_URL = os.environ.get("CLERK_BACKEND_URL")
CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY")

# OpenAI
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Sentry configuration
SENTRY_DSN = os.environ.get("SENTRY_DSN")
