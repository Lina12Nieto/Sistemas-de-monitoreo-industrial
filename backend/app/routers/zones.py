from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ZoneResponse, ZoneWithActiveSensorsResponse, ZoneCreate
from app.schemas.monitoring import MonitoringDetailResponse
from app.services import get_all_zones, get_zone_by_id, get_active_sensors_in_zone, count_active_sensors_in_zone, create_zone

router = APIRouter(prefix="/zones", tags=["Zones"])

@router.get("/", response_model=list[ZoneWithActiveSensorsResponse])
def list_zones(db: Session = Depends(get_db)):
    """Listar todas las zonas con conteo de sensores activos"""
    zones = get_all_zones(db)
    result = []
    for zone in zones:
        count = count_active_sensors_in_zone(db, zone.id)
        zone_dict = zone.__dict__.copy()
        zone_dict["active_sensors_count"] = count
        result.append(ZoneWithActiveSensorsResponse(**zone_dict))
    return result

@router.get("/{zone_id}/sensors", response_model=list[MonitoringDetailResponse])
def list_sensors_in_zone(zone_id: int, db: Session = Depends(get_db)):
    """Ver sensores activos en una zona"""
    return get_active_sensors_in_zone(db, zone_id)

@router.post("/", response_model=ZoneResponse, status_code=201)
def create_zone_endpoint(
    zone_data: ZoneCreate,
    db: Session = Depends(get_db)
):
    """Crear una nueva zona"""
    return create_zone(db, zone_data)