from pydantic import BaseModel, Field
from datetime import date, datetime
from app.models.enums import SensorTypeEnum

class SensorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: SensorTypeEnum
    manufacturer: str = Field(..., min_length=1, max_length=100)
    manufacturing_date: date

class SensorCreate(SensorBase):
    pass

class SensorResponse(SensorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True