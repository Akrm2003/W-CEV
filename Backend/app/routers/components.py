from fastapi import APIRouter, HTTPException, Query

from app.crud.component import (
    create_component as crud_create,
    get_components as crud_list,
    get_component as crud_get,
    update_component as crud_update,
    delete_component as crud_delete,
)
from app.schemas.component import (
    ComponentCreate,
    ComponentUpdate,
    ComponentResponse,
    ComponentListResponse,
)

router = APIRouter(prefix="/components", tags=["components"])


@router.get("", response_model=ComponentListResponse)
async def list_components(
    search: str = Query("", description="Search by name or description"),
    sort_by: str = Query("updated_at", description="Sort by: name, created_at, updated_at"),
    order: str = Query("desc", description="Order: asc, desc"),
):
    """List all components with optional search and sorting."""
    components = await crud_list(search=search, sort_by=sort_by, order=order)
    return ComponentListResponse(components=components, total=len(components))


@router.post("", response_model=ComponentResponse, status_code=201)
async def create_component(payload: ComponentCreate):
    """Create a new component."""
    component = await crud_create(
        name=payload.name,
        description=payload.description,
        html=payload.html,
    )
    return component


@router.get("/{component_id}", response_model=ComponentResponse)
async def get_component(component_id: str):
    """Get a single component by ID."""
    component = await crud_get(component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component


@router.put("/{component_id}", response_model=ComponentResponse)
async def update_component(component_id: str, payload: ComponentUpdate):
    """Update a component (partial update)."""
    update_data = payload.model_dump(exclude_unset=True)

    # Convert is_favorite bool to int for SQLite
    if "is_favorite" in update_data and update_data["is_favorite"] is not None:
        update_data["is_favorite"] = int(update_data["is_favorite"])

    component = await crud_update(component_id, **update_data)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component


@router.delete("/{component_id}", status_code=204)
async def delete_component(component_id: str):
    """Delete a component."""
    deleted = await crud_delete(component_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Component not found")
    return None
