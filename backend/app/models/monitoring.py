from sqlalchemy import Column, Integer, Date, Numeric, DateTime, Enum, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.enums import ReadingTypeEnum, MonitoringStatusEnum

class Monitoring(Base):
    """
    Entidad intermedia que vincula un sensor con una zona para su supervisión.
    """
    __tablename__ = "monitorings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id", ondelete="CASCADE"), nullable=False, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id", ondelete="CASCADE"), nullable=False, index=True)
    installation_date = Column(Date, nullable=False)
    reading_type = Column(Enum(ReadingTypeEnum), nullable=False)
    threshold_value = Column(Numeric(10, 2), nullable=False)
    current_value = Column(Numeric(10, 2), nullable=False, default=0)
    status = Column(Enum(MonitoringStatusEnum), nullable=False, default=MonitoringStatusEnum.activo)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("sensor_id", "zone_id", name="uq_sensor_zone"),
    )

    sensor = relationship("Sensor", back_populates="monitorings")
    zone = relationship("Zone", back_populates="monitorings")