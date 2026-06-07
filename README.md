# Sistema de Monitoreo Industrial — Tecnimatica

Sistema para rastrear sensores asignados a zonas de una planta industrial, con predicción de alertas basadas en umbrales configurados.

## Links

- **Repositorio:** `https://github.com/tu-usuario/sistemas-de-monitoreo-industrial`

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Python 3.11 + FastAPI |
| ORM | SQLAlchemy |
| Base de datos | PostgreSQL (Render) |
| Frontend | React + Vite |
| HTTP Client | Axios |
| Estilos | Tailwind CSS |
| Control de versiones | Git + GitHub |

---

## Estructura del proyecto

```
sistemas-de-monitoreo-industrial/
│
├── backend/
│   └── app/
│       ├── models/          # Modelos SQLAlchemy
│       │   ├── enums.py
│       │   ├── sensor.py
│       │   ├── zone.py
│       │   └── monitoring.py
│       ├── schemas/         # Schemas Pydantic
│       │   ├── sensor.py
│       │   ├── zone.py
│       │   ├── monitoring.py
│       │   └── error.py
│       ├── services/        # Lógica de negocio
│       │   ├── sensor_service.py
│       │   ├── zone_service.py
│       │   └── monitoring_service.py
│       ├── routers/         # Endpoints REST
│       │   ├── sensors.py
│       │   ├── zones.py
│       │   └── monitorings.py
│       ├── database.py      # Conexión PostgreSQL
│       └── main.py          # App FastAPI + CORS
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       └── services/
│
├── schema.sql               # Esquema completo + seed data
├── DECISIONS.md
└── README.md
```

---

## Correr el proyecto localmente

### Requisitos previos

- Python 3.11+
- Node.js 18+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/sistemas-de-monitoreo-industrial.git
cd sistemas-de-monitoreo-industrial
```

### 2. Configurar el Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv venv
source venv/Scripts/activate   # Windows (Git Bash)
source venv/bin/activate       # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con tu URL de base de datos:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_db
```

```bash
# Iniciar el servidor
uvicorn app.main:app --reload
```

El backend estará disponible en: `http://localhost:8000`
Documentación Swagger: `http://localhost:8000/docs`

### 3. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/sensors` | Listar todos los sensores |
| `GET` | `/sensors/{id}/zones` | Ver zonas monitoreadas por un sensor |
| `GET` | `/zones` | Listar zonas con conteo de sensores activos |
| `GET` | `/zones/{id}/sensors` | Ver sensores activos en una zona |
| `GET` | `/monitorings` | Listar monitoreos (filtro opcional `?status=activo`) |
| `POST` | `/monitorings` | Asignar un sensor a una zona |
| `PATCH` | `/monitorings/{id}` | Actualizar umbral o estado de un monitoreo |
| `POST` | `/sensors` | Crear un nuevo sensor |
| `POST` | `/zones` | Crear una nueva zona |

---

## Base de datos

El archivo `schema.sql` en la raíz del proyecto contiene:

- Esquema completo de tablas y tipos ENUM
- 10 sensores de prueba
- 10 zonas de prueba  
- 15 monitoreos de prueba (6 con alertas activas)

Para ejecutar el schema en tu base de datos:

```bash
psql "postgresql://usuario:contraseña@host:5432/nombre_db" -f schema.sql
```

> **Nota:** Si usas el backend con `uvicorn`, las tablas se crean automáticamente al iniciar el servidor gracias a SQLAlchemy.

---

## Indicador de alertas

El campo `is_alert` en cada monitoreo se calcula automáticamente:

```
is_alert = true  →  cuando current_value > threshold_value
is_alert = false →  cuando current_value ≤ threshold_value
```

---