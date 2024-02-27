# Load environment variables first
from dotenv import load_dotenv

load_dotenv()

from contextlib import asynccontextmanager
from db.db import close_db_pool, create_db_pool
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import home, users
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


# Setup DB pool when the server starts and close it when the server shuts down
@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_pool()
    yield
    await close_db_pool()


# Setup FastAPI
app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None, lifespan=lifespan)

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
app.include_router(users.router, prefix="/users")
