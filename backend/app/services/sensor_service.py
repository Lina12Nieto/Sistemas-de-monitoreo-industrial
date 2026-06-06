from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Sensor, Monitoring
from app.schemas import SensorCreate

def get_all_sensors(db: Session):
    """Obtiene todos los sensores"""
    return db.query(Sensor).all()

def get_sensor_by_id(db: Session, sensor_id: int):
    """Obtiene un sensor por ID"""
    sensor = db.query(Sensor).filter(Sensor.id == sensor_id).first()
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor con id {sensor_id} no encontrado"
        )
    return sensor

def get_zones_by_sensor(db: Session, sensor_id: int):
    """Obtiene las zonas monitoreadas por un sensor"""
    get_sensor_by_id(db, sensor_id)
    return db.query(Monitoring).filter(
        Monitoring.sensor_id == sensor_id
    ).all()

def create_sensor(db: Session, sensor_data: SensorCreate):
    """Crea un nuevo sensor"""
    db_sensor = Sensor(**sensor_data.dict())
    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)
    return db_sensor