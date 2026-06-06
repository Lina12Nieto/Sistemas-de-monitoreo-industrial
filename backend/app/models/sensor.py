from sqlalchemy import Column, Integer, String, Date, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.enums import SensorTypeEnum

class Sensor(Base):
    """
    Representa un dispositivo de medición dentro del sistema.
    """
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(Enum(SensorTypeEnum), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    manufacturing_date = Column(Date, nullable=False)
    created_at = Column(DateTime, nullable=False, default=func.now())

    monitorings = relationship("Monitoring", back_populates="sensor", cascade="all, delete-orphan")