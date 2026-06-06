from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import SensorResponse, SensorCreate
from app.schemas.monitoring import MonitoringDetailResponse
from app.services import get_all_sensors, get_sensor_by_id, get_zones_by_sensor, create_sensor

router = APIRouter(prefix="/sensors", tags=["Sensors"])

@router.get("/", response_model=list[SensorResponse])
def list_sensors(db: Session = Depends(get_db)):
    """Listar todos los sensores"""
    return get_all_sensors(db)

@router.get("/{sensor_id}/zones", response_model=list[MonitoringDetailResponse])
def list_zones_by_sensor(sensor_id: int, db: Session = Depends(get_db)):
    """Ver zonas monitoreadas por un sensor"""
    return get_zones_by_sensor(db, sensor_id)

@router.post("/", response_model=SensorResponse, status_code=201)
def create_sensor_endpoint(
    sensor_data: SensorCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo sensor"""
    return create_sensor(db, sensor_data)