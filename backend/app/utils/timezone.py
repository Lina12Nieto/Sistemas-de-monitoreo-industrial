from datetime import datetime
import pytz

COLOMBIA_TZ = pytz.timezone('America/Bogota')

def now_colombia():
    """Retorna la hora actual en zona horaria de Colombia"""
    return datetime.now(COLOMBIA_TZ).replace(tzinfo=None)