from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ComponentCreate(BaseModel):
    name: str = Field(default="Untitled Component", max_length=200)
    description: str = Field(default="", max_length=2000)
    html: str = Field(default="")


class ComponentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    html: Optional[str] = None
    is_favorite: Optional[bool] = None


class ComponentResponse(BaseModel):
    id: str
    name: str
    description: str
    html: str
    is_favorite: bool
    created_at: str
    updated_at: str


class ComponentListResponse(BaseModel):
    components: list[ComponentResponse]
    total: int
