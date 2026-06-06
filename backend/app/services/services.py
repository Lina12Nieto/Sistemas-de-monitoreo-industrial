from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from decimal import Decimal
from app.models import Sensor, Zone, Monitoring, MonitoringStatusEnum
from app.schemas import MonitoringCreate, MonitoringUpdate

#  SENSOR SERVICES 

def get_all_sensors(db: Session):
    """Obtiene todos los sensores"""
    sensors = db.query(Sensor).all()
    return sensors

def get_sensor_by_id(db: Session, sensor_id: int):
    """Obtiene un sensor por ID"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor with id {sensor_id} not found"
        )
    return sensor

def create_sensor(db: Session, sensor):
    """Crea un nuevo sensor"""
    db_sensor = Sensor(**sensor.dict())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor

# ZONE SERVICES 

def get_all_zones(db: Session):
    """Obtiene todas las zonas"""
    zones = db.query(Zone).all()
    return zones

def get_zone_by_id(db: Session, zone_id: int):
    """Obtiene una zona por ID"""
    zone = db.query(Zone).filter(Zone.id == zone_id).first()
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zone with id {zone_id} not found"
        )
    return zone

def get_active_sensors_in_zone(db: Session, zone_id: int):
    """Obtiene los sensores activos en una zona"""
    
    zone = get_zone_by_id(db, zone_id)
    
    # Obtiene los monitoreos activos para esa zona
    monitorings = db.query(Monitoring).filter(
        and_(
            Monitoring.zone_id == zone_id,
            Monitoring.status == MonitoringStatusEnum.ACTIVO
        )
    ).all()
    
    return monitorings

def count_active_sensors_in_zone(db: Session, zone_id: int) -> int:
    """Cuenta los sensores activos en una zona"""
    count = db.query(Monitoring).filter(
        and_(
            Monitoring.zone_id == zone_id,
            Monitoring.status == MonitoringStatusEnum.ACTIVO
        )
    ).count()
    return count

# MONITORING SERVICES 

def get_all_monitorings(db: Session, status: str = None):
    """Obtiene todos los monitoreos, opcionalmente filtrado por estado"""
    query = db.query(Monitoring)
    
    if status:
        try:
            status_enum = MonitoringStatusEnum(status)
            query = query.filter(Monitoring.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be 'activo' or 'pausado'"
            )
    
    return query.all()

def get_monitoring_by_id(db: Session, monitoring_id: int):
    """Obtiene un monitoreo por ID"""
    monitoring = db.query(Monitoring).filter(Monitoring.id == monitoring_id).first()
    if not monitoring:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Monitoring with id {monitoring_id} not found"
        )
    return monitoring

def create_monitoring(db: Session, monitoring_data: MonitoringCreate):
    """Crea un nuevo monitoreo (asigna sensor a zona)"""
    # Validar que el sensor exista
    sensor = db.query(Sensor).filter(Sensor.id == monitoring_data.sensor_id).first()
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor with id {monitoring_data.sensor_id} not found"
        )
    
    # Validar que la zona exista
    zone = db.query(Zone).filter(Zone.id == monitoring_data.zone_id).first()
    if not zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zone with id {monitoring_data.zone_id} not found"
        )
    
    # Validar UNIQUE: no asignar el mismo sensor a la misma zona dos veces
    existing = db.query(Monitoring).filter(
        and_(
            Monitoring.sensor_id == monitoring_data.sensor_id,
            Monitoring.zone_id == monitoring_data.zone_id
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sensor {monitoring_data.sensor_id} is already assigned to zone {monitoring_data.zone_id}"
        )
    
    # Crear el monitoreo
    db_monitoring = Monitoring(**monitoring_data.dict())
    db.add(db_monitoring)
    db.commit()
    db.refresh(db_monitoring)
    return db_monitoring

def update_monitoring(db: Session, monitoring_id: int, update_data: MonitoringUpdate):
    """Actualiza un monitoreo (umbral o estado)"""
    monitoring = get_monitoring_by_id(db, monitoring_id)
    
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(monitoring, key, value)
    
    db.commit()
    db.refresh(monitoring)
    return monitoring

def get_zones_by_sensor(db: Session, sensor_id: int):
    """Obtiene las zonas monitoreadas por un sensor"""
    
    sensor = get_sensor_by_id(db, sensor_id)
    
    
    monitorings = db.query(Monitoring).filter(
        Monitoring.sensor_id == sensor_id
    ).all()
    
    return monitorings
