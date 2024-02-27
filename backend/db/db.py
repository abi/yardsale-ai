import asyncpg

from config import DB_DSN

db_pool = None


async def create_db_pool():
    global db_pool
    db_pool = await asyncpg.create_pool(
        dsn=DB_DSN,
        max_size=40,
        min_size=5,
        max_inactive_connection_lifetime=0,
    )
    if db_pool is None:
        raise Exception("Failed to create database pool")


async def close_db_pool():
    global db_pool
    if db_pool is not None:
        await db_pool.close()
        db_pool = None


def get_db_pool():
    global db_pool
    if db_pool is None:
        raise Exception(
            "Database pool is not initialized. Ensure that setup_db() is called during the application startup."
        )
    return db_pool
