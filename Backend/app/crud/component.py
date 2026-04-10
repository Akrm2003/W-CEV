import uuid
from datetime import datetime

import aiosqlite

from app.core.database import get_db


async def create_component(name: str = "Untitled Component", description: str = "", html: str = "") -> dict:
    """Create a new component and return it."""
    component_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    db = await get_db()
    try:
        await db.execute(
            "INSERT INTO components (id, name, description, html, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (component_id, name, description, html, now, now),
        )
        await db.commit()

        cursor = await db.execute("SELECT * FROM components WHERE id = ?", (component_id,))
        row = await cursor.fetchone()
        return _row_to_dict(row)
    finally:
        await db.close()


async def get_components(search: str = "", sort_by: str = "updated_at", order: str = "desc") -> list[dict]:
    """List all components with optional search and sorting."""
    valid_sort = {"name", "created_at", "updated_at"}
    valid_order = {"asc", "desc"}
    sort_by = sort_by if sort_by in valid_sort else "updated_at"
    order = order if order in valid_order else "desc"

    db = await get_db()
    try:
        if search:
            query = f"SELECT * FROM components WHERE name LIKE ? OR description LIKE ? ORDER BY {sort_by} {order}"
            cursor = await db.execute(query, (f"%{search}%", f"%{search}%"))
        else:
            query = f"SELECT * FROM components ORDER BY {sort_by} {order}"
            cursor = await db.execute(query)

        rows = await cursor.fetchall()
        return [_row_to_dict(row) for row in rows]
    finally:
        await db.close()


async def get_component(component_id: str) -> dict | None:
    """Get a single component by ID."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM components WHERE id = ?", (component_id,))
        row = await cursor.fetchone()
        return _row_to_dict(row) if row else None
    finally:
        await db.close()


async def update_component(component_id: str, **kwargs) -> dict | None:
    """Update a component. Only updates fields that are provided."""
    db = await get_db()
    try:
        # Check exists
        cursor = await db.execute("SELECT * FROM components WHERE id = ?", (component_id,))
        row = await cursor.fetchone()
        if not row:
            return None

        # Build SET clause from provided kwargs
        fields = {k: v for k, v in kwargs.items() if v is not None}
        if not fields:
            return _row_to_dict(row)

        fields["updated_at"] = datetime.utcnow().isoformat()

        set_clause = ", ".join(f"{k} = ?" for k in fields)
        values = list(fields.values()) + [component_id]

        await db.execute(f"UPDATE components SET {set_clause} WHERE id = ?", values)
        await db.commit()

        cursor = await db.execute("SELECT * FROM components WHERE id = ?", (component_id,))
        row = await cursor.fetchone()
        return _row_to_dict(row)
    finally:
        await db.close()


async def delete_component(component_id: str) -> bool:
    """Delete a component. Returns True if deleted."""
    db = await get_db()
    try:
        cursor = await db.execute("DELETE FROM components WHERE id = ?", (component_id,))
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()


def _row_to_dict(row: aiosqlite.Row) -> dict:
    """Convert an aiosqlite Row to a dict."""
    return {
        "id": row["id"],
        "name": row["name"],
        "description": row["description"],
        "html": row["html"],
        "is_favorite": bool(row["is_favorite"]),
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
