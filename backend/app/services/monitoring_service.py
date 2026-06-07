from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models import Sensor, Zone, Monitoring, MonitoringStatusEnum
from app.schemas import MonitoringCreate, MonitoringUpdate

def get_all_monitorings(db: Session, status_filter: str = None):
    """Obtiene todos los monitoreos, opcionalmente filtrado por estado"""
    query = db.query(Monitoring)
    if status_filter:
        try:
            status_enum = MonitoringStatusEnum(status_filter)
            query = query.filter(Monitoring.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Debe ser 'activo' o 'pausado'"
            )
    return query.all()

def get_monitoring_by_id(db: Session, monitoring_id: int):
    """Obtiene un monitoreo por ID"""
    monitoring = db.query(Monitoring).filter(Monitoring.id == monitoring_id).first()
    if not monitoring:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Monitoreo con id {monitoring_id} no encontrado"
        )
    return monitoring

def create_monitoring(db: Session, monitoring_data: MonitoringCreate):
    """Crea un nuevo monitoreo (asigna sensor a zona)"""
    if not db.query(Sensor).filter(Sensor.id == monitoring_data.sensor_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor con id {monitoring_data.sensor_id} no encontrado"
        )
    if not db.query(Zone).filter(Zone.id == monitoring_data.zone_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zona con id {monitoring_data.zone_id} no encontrada"
        )
    existing = db.query(Monitoring).filter(
        and_(
            Monitoring.sensor_id == monitoring_data.sensor_id,
            Monitoring.zone_id == monitoring_data.zone_id
        )
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El sensor {monitoring_data.sensor_id} ya está asignado a la zona {monitoring_data.zone_id}"
        )
    db_monitoring = Monitoring(**monitoring_data.dict())
    db.add(db_monitoring)
    db.commit()
    db.refresh(db_monitoring)
    return db_monitoring

def update_monitoring(db: Session, monitoring_id: int, update_data: MonitoringUpdate):
    """Actualiza umbral o estado de un monitoreo"""
    monitoring = get_monitoring_by_id(db, monitoring_id)
    
    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(monitoring, key, value)
    
    # Recalcular is_alert con los valores actualizados
    monitoring.is_alert = monitoring.current_value > monitoring.threshold_value

    db.commit()
    db.refresh(monitoring)
    return monitoring