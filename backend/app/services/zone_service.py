from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models import Zone, Monitoring, MonitoringStatusEnum

def get_all_zones(db: Session):
    """Obtiene todas las zonas"""
    return db.query(Zone).all()

def get_zone_by_id(db: Session, zone_id: int):
    """Obtiene una zona por ID"""
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zona con id {zone_id} no encontrada"
        )
    return zone

def get_active_sensors_in_zone(db: Session, zone_id: int):
    """Obtiene los sensores activos en una zona"""
    get_zone_by_id(db, zone_id)
    return db.query(Monitoring).filter(
        and_(
            Monitoring.zone_id == zone_id,
            Monitoring.status == MonitoringStatusEnum.ACTIVO
        )
    ).all()

def count_active_sensors_in_zone(db: Session, zone_id: int) -> int:
    """Cuenta los sensores activos en una zona"""
    return db.query(Monitoring).filter(
        and_(
            Monitoring.zone_id == zone_id,
            Monitoring.status == MonitoringStatusEnum.ACTIVO
        )
    ).count()