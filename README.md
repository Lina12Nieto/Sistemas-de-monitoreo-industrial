# Sistema de Monitoreo Industrial

Aplicacion web para gestionar sensores industriales, zonas de monitoreo y asignaciones entre ambos. El sistema permite registrar sensores, consultar zonas, asignar sensores a zonas, configurar umbrales, pausar o activar monitoreos y visualizar alertas cuando una lectura supera el umbral configurado.

## Tabla de contenido

- [Caracteristicas](#caracteristicas)
- [Stack tecnologico](#stack-tecnologico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Configuracion local](#configuracion-local)
- [Base de datos](#base-de-datos)
- [Ejecutar backend](#ejecutar-backend)
- [Ejecutar frontend](#ejecutar-frontend)
- [Endpoints principales](#endpoints-principales)
- [Variables de entorno](#variables-de-entorno)
- [Comandos utiles](#comandos-utiles)
- [Documentacion de entrega](#documentacion-de-entrega)
- [Solucion de problemas](#solucion-de-problemas)

## Caracteristicas

- Listado de sensores registrados.
- Listado de zonas con conteo de sensores activos.
- Vista detalle de una zona con sus sensores asignados.
- Formulario para asignar un sensor a una zona.
- Configuracion de tipo de lectura y valor umbral.
- Actualizacion de umbral, valor actual y estado del monitoreo.
- Indicador visual de monitoreo activo o pausado.
- Alerta visual cuando `current_value > threshold_value`.
- API REST documentada automaticamente con Swagger.

## Stack tecnologico

| Capa | Tecnologia |
|---|---|
| Backend | Python 3.11+, FastAPI |
| ORM | SQLAlchemy |
| Validacion | Pydantic |
| Base de datos | PostgreSQL en Render |
| Frontend | React + Vite |
| Cliente HTTP | Axios |
| Estilos | Tailwind CSS |
| Iconos | Lucide React |
| Control de versiones | Git + GitHub |

## Estructura del proyecto

```text
Sistemas-de-monitoreo-industrial/
|-- backend/
|   |-- app/
|   |   |-- models/          # Modelos ORM de SQLAlchemy
|   |   |-- schemas/         # Schemas Pydantic para requests/responses
|   |   |-- services/        # Logica de negocio
|   |   |-- routers/         # Endpoints REST
|   |   |-- database.py      # Conexion a PostgreSQL
|   |   `-- main.py          # Aplicacion FastAPI y CORS
|   |-- .env.example
|   `-- requirements.txt
|
|-- frontend/
|   |-- src/
|   |   |-- components/      # Componentes reutilizables
|   |   |-- pages/           # Vistas principales
|   |   |-- services/        # Cliente Axios
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- .env.example
|   |-- package.json
|   `-- vite.config.js
|
|-- schema.sql               # Esquema completo y datos de prueba
|-- DECISIONS.md             # Decisiones tecnicas del proyecto
|-- INFORME_CUMPLIMIENTO.md  # Revision de cumplimiento de requisitos
`-- README.md
```

## Requisitos previos

Antes de ejecutar el proyecto localmente, instala:

- Python 3.11 o superior.
- Node.js 18 o superior.
- Git.

Opcional para cargar el archivo `schema.sql` en Render desde terminal:

- Cliente `psql` de PostgreSQL.

## Configuracion local

Clona el repositorio y entra a la carpeta principal:

```bash
git clone <https://github.com/Lina12Nieto/Sistemas-de-monitoreo-industrial.git>
cd Sistemas-de-monitoreo-industrial
```

Si ya tienes el proyecto en tu equipo, solo entra a la carpeta raiz:

```bash
cd Sistemas-de-monitoreo-industrial
```

## Base de datos

La base de datos del proyecto esta alojada en **Render** usando PostgreSQL. Para ejecutar el proyecto localmente no se configura una base de datos local: solo debes modificar el archivo `backend/.env` con la URL de conexion entregada por Render.

El archivo `schema.sql` contiene:

- Tipos enumerados para sensores, lecturas, estados de monitoreo y estados de zona.
- Tabla `sensors`.
- Tabla `zones`.
- Tabla `monitorings`, que modela la relacion muchos a muchos entre sensores y zonas.
- Restriccion `UNIQUE(sensor_id, zone_id)` para evitar duplicar una asignacion.
- 10 sensores de prueba.
- 10 zonas de prueba.
- 15 monitoreos de prueba.

### Usar PostgreSQL en Render

En Render, copia la URL externa de la base de datos PostgreSQL proporcioanda en el email y usala en el archivo `backend/.env`:

```env
DATABASE_URL=postgresql://usuario:password@host-render:5432/nombre_db
```

En algunas conexiones externas puede ser necesario agregar `?sslmode=require` al final de la URL:

```env
DATABASE_URL=postgresql://usuario:password@host-render:5432/nombre_db?sslmode=require
```

### Cargar el esquema en Render

Si la base de datos de Render esta vacia, carga el archivo `schema.sql` desde la raiz del proyecto:

```bash
psql "postgresql://usuario:password@host-render:5432/nombre_db?sslmode=require" -f schema.sql
```

Reemplaza los datos de ejemplo por la URL real de Render.

## Ejecutar backend

Entra a la carpeta del backend:

```bash
cd backend
```

### 1. Crear entorno virtual

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Windows CMD:

```cmd
python -m venv .venv
.\.venv\Scripts\activate.bat
```

Git Bash:

```bash
python -m venv .venv
source .venv/Scripts/activate
```

Mac/Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Crear archivo de variables de entorno backend/.env 

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Windows CMD:

```cmd
copy .env.example .env
```

Git Bash o Mac/Linux:

```bash
cp .env.example .env
```

Edita `backend/.env` y configura tu conexion a PostgreSQL en Render:

```env
DATABASE_URL=postgresql://usuario:password@host-render:5432/nombre_db?sslmode=require
```

### 4. Iniciar servidor Git Bash

```bash
uvicorn app.main:app --reload
```

El backend quedara disponible en:

```text
http://localhost:8000
```

Documentacion Swagger:

```text
http://localhost:8000/docs
```

## Ejecutar frontend

Abre otra terminal desde la raiz del proyecto y entra a `frontend`:

```bash
cd frontend
```

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear archivo de variables de entorno frontend / .env

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Windows CMD:

```cmd
copy .env.example .env
```

Git Bash o Mac/Linux:

```bash
cp .env.example .env
```

Edita `frontend/.env` y confirma que apunte al backend local:

```env
VITE_API_URL=http://
```

### 3. Iniciar servidor de desarrollo Git Bash

```bash
npm run dev
```


El frontend quedara disponible normalmente en:

```text
http://localhost:5173
```

## Endpoints principales

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/sensors/` | Lista todos los sensores. |
| `POST` | `/sensors/` | Crea un sensor. |
| `GET` | `/sensors/{sensor_id}/zones` | Lista las zonas monitoreadas por un sensor. |
| `GET` | ``/zones/{zone_id}/sensors``| Lista las zonas con conteo de sensores activos. |
| `POST` | `/zones/` | Crea una zona. |
| `GET` | `/zones/{zone_id}/sensorsall` | Lista los sensores de una zona. |
| `GET` | `/monitorings/` | Lista monitoreos. Permite filtro opcional por estado. |
| `POST` | `/monitorings/` | Asigna un sensor a una zona. |
| `PATCH` | `/monitorings/{monitoring_id}` | Actualiza umbral, valor actual o estado. |

Ejemplo de filtro por estado:

```text
GET /monitorings/?status=activo
GET /monitorings/?status=pausado
```

## Variables de entorno

### Backend

Archivo: `backend/.env`

```env
DATABASE_URL=postgresql://usuario:password@host-render:5432/nombre_db?sslmode=require
```

### Frontend

Archivo: `frontend/.env`

```env
VITE_API_URL=http://127.0.0.1:8000
```


## Solucion de problemas

### El frontend no se conecta al backend

Verifica que:

- El backend este corriendo en `http://localhost:8000`.
- `frontend/.env` tenga `VITE_API_URL=http://localhost:8000`.
- Reiniciaste Vite despues de cambiar el archivo `.env`.

### El backend no inicia por `DATABASE_URL`

Verifica que:

- Existe el archivo `backend/.env`.
- La variable `DATABASE_URL` esta escrita correctamente.
- La base de datos de Render esta activa.
- El usuario y password son correctos.
- Si usas conexion externa a Render, la URL puede requerir `sslmode=require`.

### No aparecen datos en la aplicacion

Verifica que cargaste `schema.sql` en la base de datos de Render:

```bash
psql "postgresql://usuario:password@host-render:5432/nombre_db?sslmode=require" -f schema.sql
```

Tambien puedes revisar la API en:

```text
http://localhost:8000/docs
```
