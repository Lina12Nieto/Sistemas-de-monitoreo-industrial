from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.enums import ZoneStatusEnum

class Zone(Base):
    """
    Representa una región física supervisada en el sistema.
    """
    __tablename__ = "zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=True)
    location = Column(String(150), nullable=False)
    operational_status = Column(Enum(ZoneStatusEnum), nullable=False, default=ZoneStatusEnum.OPERACIONAL)
    created_at = Column(DateTime, nullable=False, default=func.now())

    monitorings = relationship("Monitoring", back_populates="zone", cascade="all, delete-orphan")