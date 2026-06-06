from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import sensors, zones, monitorings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Monitoreo Industrial",
    description="API para gestionar sensores y zonas de monitoreo",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sensors.router)
app.include_router(zones.router)
app.include_router(monitorings.router)

@app.get("/")
def root():
    return {"message": "API de Monitoreo Industrial activa"}