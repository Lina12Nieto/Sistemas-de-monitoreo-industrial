import enum

class SensorTypeEnum(str, enum.Enum):
    TEMPERATURA = "temperatura"
    PRESION = "presion"
    VIBRACION = "vibracion"
    FLUJO = "flujo"

class ReadingTypeEnum(str, enum.Enum):
    TEMPERATURA = "temperatura"
    PRESION = "presion"
    VIBRACION = "vibracion"
    FLUJO = "flujo"

class MonitoringStatusEnum(str, enum.Enum):
    ACTIVO = "activo"
    PAUSADO = "pausado"

class ZoneStatusEnum(str, enum.Enum):
    OPERACIONAL = "operacional"
    MANTENIMIENTO = "mantenimiento"
    INACTIVO = "inactivo"