from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.schemas.monitoring import MonitoringCreate, MonitoringUpdate, MonitoringDetailResponse
from app.services import get_all_monitorings, get_monitoring_by_id, create_monitoring, update_monitoring

router = APIRouter(prefix="/monitorings", tags=["Monitorings"])

@router.get("/", response_model=list[MonitoringDetailResponse])
def list_monitorings(
    status: Optional[str] = Query(None, description="Filtrar por estado: 'activo' o 'pausado'"),
    db: Session = Depends(get_db)
):
    """Listar todos los monitoreos con filtro opcional por estado"""
    return get_all_monitorings(db, status_filter=status)

@router.post("/", response_model=MonitoringDetailResponse, status_code=201)
def assign_sensor_to_zone(
    monitoring_data: MonitoringCreate,
    db: Session = Depends(get_db)
):
    """Asignar un sensor a una zona"""
    return create_monitoring(db, monitoring_data)

@router.patch("/{monitoring_id}", response_model=MonitoringDetailResponse)
def update_monitoring_endpoint(
    monitoring_id: int,
    update_data: MonitoringUpdate,
    db: Session = Depends(get_db)
):
    """Actualizar umbral o estado de un monitoreo"""
    return update_monitoring(db, monitoring_id, update_data)