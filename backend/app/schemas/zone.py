from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models.enums import ZoneStatusEnum

class ZoneBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    location: str = Field(..., min_length=1, max_length=150)
    operational_status: ZoneStatusEnum = ZoneStatusEnum.OPERACIONAL

class ZoneCreate(ZoneBase):
    pass

class ZoneResponse(ZoneBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ZoneWithActiveSensorsResponse(ZoneResponse):
    active_sensors_count: int = 0