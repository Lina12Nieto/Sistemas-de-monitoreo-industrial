from sqlalchemy import Column, Integer, String, Date, Numeric, Enum, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum
from datetime import datetime

# ENUMs
class SensorTypeEnum(str, enum.Enum):
    TEMPERATURA = "temperatura"
    PRESION = "presion"
    VIBRACION = "vibracion"
    FLUJO = "flujo"

class ReadingTypeEnum(str, enum.Enum):
    TEMPERATURA = "temperatura"
    PRESION = "presion"
    VIBRACION = "vibracion"
    FLUJO = "flujo"

class MonitoringStatusEnum(str, enum.Enum):
    ACTIVO = "activo"
    PAUSADO = "pausado"

class ZoneStatusEnum(str, enum.Enum):
    OPERACIONAL = "operacional"
    MANTENIMIENTO = "mantenimiento"
    INACTIVO = "inactivo"

# Models
class Sensor(Base):
    """
    Representa un dispositivo de medición dentro del sistema.

    Esta clase mapea la tabla 'sensors' en la base de datos y almacena
    la información estática y de fabricación de cada sensor, así como
    el historial de lecturas asociadas. 
    """

    __tablename__ = "sensors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum(SensorTypeEnum), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    manufacturing_date = Column(Date, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())
    
    monitorings = relationship("Monitoring", back_populates="sensor", cascade="all, delete-orphan")

class Zone(Base):
    """
    Representa una región geográfica o física supervisada en el sistema.

    Mapea la tabla 'zones' y agrupa múltiples dispositivos de monitoreo
    para controlar variables ambientales o de seguridad en áreas específicas.
    """

    __tablename__ = "zones"
    
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    location = Column(String(150), nullable=False)
    operational_status = Column(Enum(ZoneStatusEnum), nullable=False, default=ZoneStatusEnum.OPERACIONAL)
    created_at = Column(DateTime, nullable=False, default=func.now())
    
    monitorings = relationship("Monitoring", back_populates="zone", cascade="all, delete-orphan")

class Monitoring(Base):

    """
    Entidad intermedia que vincula un sensor con una zona específica para su supervisión.

    Mapea la tabla 'monitorings'. Establece los umbrales de alerta y registra el 
    estado en tiempo real de la telemetría. Cada sensor solo puede estar asignado 
    a una zona a la vez de forma activa.
    """
    
    __tablename__ = "monitorings"
    
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id", ondelete="CASCADE"), nullable=False, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id", ondelete="CASCADE"), nullable=False, index=True)
    installation_date = Column(Date, nullable=False)
    reading_type = Column(Enum(ReadingTypeEnum), nullable=False)
    threshold_value = Column(Numeric(10, 2), nullable=False)
    current_value = Column(Numeric(10, 2), nullable=False, default=0)
    status = Column(Enum(MonitoringStatusEnum), nullable=False, default=MonitoringStatusEnum.ACTIVO)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint("sensor_id", "zone_id", name="uq_sensor_zone"),
    )
    
    sensor = relationship("Sensor", back_populates="monitorings")
    zone = relationship("Zone", back_populates="monitorings")
