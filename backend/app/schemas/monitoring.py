from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from app.models.enums import ReadingTypeEnum, MonitoringStatusEnum
from app.schemas.sensor import SensorResponse
from app.schemas.zone import ZoneResponse

class MonitoringCreate(BaseModel):
    sensor_id: int
    zone_id: int
    installation_date: date
    reading_type: ReadingTypeEnum
    threshold_value: Decimal = Field(..., max_digits=10, decimal_places=2)
    status: Optional[MonitoringStatusEnum] = MonitoringStatusEnum.ACTIVO

class MonitoringUpdate(BaseModel):
    threshold_value: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    current_value: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    status: Optional[MonitoringStatusEnum] = None

class MonitoringResponse(BaseModel):
    id: int
    sensor_id: int
    zone_id: int
    installation_date: date
    reading_type: ReadingTypeEnum
    threshold_value: Decimal
    current_value: Decimal
    status: MonitoringStatusEnum
    created_at: datetime
    updated_at: datetime
    is_alert: bool = False

    class Config:
        from_attributes = True

class MonitoringDetailResponse(MonitoringResponse):
    sensor: SensorResponse
    zone: ZoneResponse