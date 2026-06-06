from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from app.models import SensorTypeEnum, ReadingTypeEnum, MonitoringStatusEnum, ZoneStatusEnum

# SENSOR SCHEMAS 

class SensorBase(BaseModel):

    """Esquema base para sensor"""
    
    name: str = Field(..., min_length=1, max_length=100)
    type: SensorTypeEnum
    manufacturer: str = Field(..., min_length=1, max_length=100)
    manufacturing_date: date

class SensorCreate(SensorBase):
    pass

class SensorResponse(SensorBase):

    """Respuesta básica de un sensor"""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ZONE SCHEMAS 

class ZoneBase(BaseModel):

    """Esquema base para zona"""

    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    location: str = Field(..., min_length=1, max_length=150)
    operational_status: ZoneStatusEnum = ZoneStatusEnum.OPERACIONAL

class ZoneCreate(ZoneBase):
    pass

class ZoneResponse(ZoneBase):

    """Respuesta básica de una zona"""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ZoneDetailResponse(ZoneResponse):

    """Respuesta detallada de una zona con sus sensores"""

    active_sensors_count: int = 0

# MONITORING SCHEMAS 

class MonitoringBase(BaseModel):

    """Esquema base para monitoreo"""

    sensor_id: int
    zone_id: int
    installation_date: date
    reading_type: ReadingTypeEnum
    threshold_value: Decimal = Field(..., max_digits=10, decimal_places=2)
    current_value: Optional[Decimal] = Field(default=0, max_digits=10, decimal_places=2)
    status: MonitoringStatusEnum = MonitoringStatusEnum.ACTIVO

class MonitoringCreate(BaseModel):

    """Esquema para crear un nuevo monitoreo"""

    sensor_id: int
    zone_id: int
    installation_date: date
    reading_type: ReadingTypeEnum
    threshold_value: Decimal = Field(..., max_digits=10, decimal_places=2)
    status: Optional[MonitoringStatusEnum] = MonitoringStatusEnum.ACTIVO

class MonitoringUpdate(BaseModel):

    """Esquema para actualizar un monitoreo existente"""

    threshold_value: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    current_value: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    status: Optional[MonitoringStatusEnum] = None

class MonitoringResponse(MonitoringBase):

    """Respuesta básica de monitoreo"""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MonitoringDetailResponse(MonitoringResponse):

    """Respuesta detallada de monitoreo con información de sensor y zona"""

    sensor: SensorResponse
    zone: ZoneResponse
    is_alert: bool = False 

# SENSOR WITH ZONES

class SensorWithZonesResponse(SensorResponse):

    """Respuesta de sensor con sus zonas monitoreadas"""

    monitorings: list[MonitoringDetailResponse] = []

# ERROR SCHEMAS 

class ErrorResponse(BaseModel):
    detail: str
    status_code: int
