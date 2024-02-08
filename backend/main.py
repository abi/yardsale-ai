# Load environment variables first
from dotenv import load_dotenv

load_dotenv()


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import home
from config import IS_PROD, SENTRY_DSN

# Setup Sentry (only relevant in prod)
if IS_PROD:
    import sentry_sdk

    if not SENTRY_DSN:
        raise Exception("SENTRY_DSN not found in prod environment")

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=0,
        profiles_sample_rate=0.1,
    )

# Setup FastAPI
app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routes
app.include_router(home.router)
