from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import sensors, zones, monitorings
from fastapi.exceptions import HTTPException
from app.middleware.error_handler import http_exception_handler, generic_exception_handler


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Monitoreo Industrial",
    description="API para gestionar sensores y zonas de monitoreo",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensors.router)
app.include_router(zones.router)
app.include_router(monitorings.router)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

@app.get("/")
def root():
    return {"message": "API de Monitoreo Industrial activa"}