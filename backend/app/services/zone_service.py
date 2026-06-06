from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.schemas import ZoneCreate
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
            Monitoring.status == MonitoringStatusEnum.activo
        )
    ).all()

def count_active_sensors_in_zone(db: Session, zone_id: int) -> int:
    """Cuenta los sensores activos en una zona"""
    return db.query(Monitoring).filter(
        and_(
            Monitoring.zone_id == zone_id,
            Monitoring.status == MonitoringStatusEnum.activo
        )
    ).count()

def create_zone(db: Session, zone_data: ZoneCreate):
    """Crea una nueva zona"""
    db_zone = Zone(**zone_data.dict())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone