import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "wcev.db")

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS components (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL DEFAULT 'Untitled Component',
    description TEXT NOT NULL DEFAULT '',
    html        TEXT NOT NULL DEFAULT '',
    is_favorite INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


async def get_db() -> aiosqlite.Connection:
    """Get a database connection (caller must close)."""
    db = await aiosqlite.connect(DB_PATH)
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    """Create tables if they don't exist."""
    db = await aiosqlite.connect(DB_PATH)
    try:
        await db.executescript(SCHEMA_SQL)
        await db.commit()
    finally:
        await db.close()
