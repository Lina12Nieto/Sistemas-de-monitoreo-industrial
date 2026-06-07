import enum

class SensorTypeEnum(str, enum.Enum):
    temperatura = "temperatura"
    presion = "presion"
    vibracion = "vibracion"
    flujo = "flujo"

class ReadingTypeEnum(str, enum.Enum):
    temperatura = "temperatura"
    presion = "presion"
    vibracion = "vibracion"
    flujo = "flujo"

class MonitoringStatusEnum(str, enum.Enum):
    activo = "activo"
    pausado = "pausado"

class ZoneStatusEnum(str, enum.Enum):
    operacional = "operacional"
    mantenimiento = "mantenimiento"
    inactivo = "inactivo"