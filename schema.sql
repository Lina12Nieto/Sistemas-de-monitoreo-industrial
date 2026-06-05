-- ------------------------------------------------------------
-- TIPOS ENUMERADOS
-- ------------------------------------------------------------

CREATE TYPE sensor_type AS ENUM (
    'temperatura',
    'presion',
    'vibracion',
    'flujo'
);

CREATE TYPE reading_type AS ENUM (
    'temperatura',
    'presion',
    'vibracion',
    'flujo'
);

CREATE TYPE monitoring_status AS ENUM (
    'activo',
    'pausado'
);

CREATE TYPE zone_status AS ENUM (
    'operacional',
    'mantenimiento',
    'inactivo'
);

-- TABLA: sensors

CREATE TABLE sensors (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    type                sensor_type  NOT NULL,
    manufacturer        VARCHAR(100) NOT NULL,
    manufacturing_date  DATE         NOT NULL,
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: zones
-- ------------------------------------------------------------

CREATE TABLE zones (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    location            VARCHAR(150) NOT NULL,
    operational_status  zone_status  NOT NULL DEFAULT 'operacional',
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TABLA: monitorings
-- Relación N:M entre sensors y zones con atributos propios.
-- UNIQUE(sensor_id, zone_id) evita asignar el mismo sensor
-- a la misma zona más de una vez.
-- ------------------------------------------------------------

CREATE TABLE monitorings (
    id                  SERIAL PRIMARY KEY,
    sensor_id           INTEGER         NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    zone_id             INTEGER         NOT NULL REFERENCES zones(id)   ON DELETE CASCADE,
    installation_date   DATE            NOT NULL,
    reading_type        reading_type    NOT NULL,
    threshold_value     NUMERIC(10, 2)  NOT NULL,
    current_value       NUMERIC(10, 2)  NOT NULL DEFAULT 0,
    status              monitoring_status NOT NULL DEFAULT 'activo',
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_sensor_zone UNIQUE (sensor_id, zone_id)
);

-- ------------------------------------------------------------
-- ÍNDICES
-- ------------------------------------------------------------

CREATE INDEX idx_monitorings_sensor_id ON monitorings(sensor_id);
CREATE INDEX idx_monitorings_zone_id   ON monitorings(zone_id);
CREATE INDEX idx_monitorings_status    ON monitorings(status);

-- ============================================================
-- SEED DATA
-- 10 sensores · 10 zonas · 15 monitorings
-- Algunos current_value superan threshold_value para activar
-- el indicador de alerta visual en el frontend.
-- ============================================================

-- ------------------------------------------------------------
-- Sensores
-- ------------------------------------------------------------

INSERT INTO sensors (name, type, manufacturer, manufacturing_date) VALUES
    ('ST-101', 'temperatura', 'Siemens',        '2021-03-15'),
    ('ST-102', 'temperatura', 'Honeywell',       '2020-07-22'),
    ('SP-201', 'presion',    'Emerson',         '2022-01-10'),
    ('SP-202', 'presion',    'ABB',             '2021-11-05'),
    ('SV-301', 'vibracion',   'SKF',             '2023-02-28'),
    ('SV-302', 'vibracion',   'Rockwell',        '2022-09-14'),
    ('SF-401', 'flujo',        'Endress+Hauser',  '2021-06-30'),
    ('SF-402', 'flujo',        'Yokogawa',        '2023-04-17'),
    ('ST-103', 'temperatura', 'ABB',             '2020-12-01'),
    ('SP-203', 'presion',    'Siemens',         '2022-08-19');

-- ------------------------------------------------------------
-- Zonas
-- ------------------------------------------------------------

INSERT INTO zones (name, description, location, operational_status) VALUES
    ('Zona A - Caldera',       'Área de calderas de vapor principal',         'Edificio 1, Piso 1',  'operacional'),
    ('Zona B - Compresores',   'Sala de compresores de aire industrial',      'Edificio 1, Piso 2',  'operacional'),
    ('Zona C - Tuberías',      'Red de tuberías de distribución',             'Edificio 2, Exterior','operacional'),
    ('Zona D - Motores',       'Área de motores eléctricos principales',      'Edificio 2, Piso 1',  'operacional'),
    ('Zona E - Almacenamiento','Tanques de almacenamiento de líquidos',       'Edificio 3, Piso 1',  'operacional'),
    ('Zona F - Refrigeración', 'Sistema de refrigeración industrial',         'Edificio 3, Piso 2',  'mantenimiento'),
    ('Zona G - Bombas',        'Sala de bombas de presión',                   'Edificio 4, Piso 1',  'operacional'),
    ('Zona H - Generadores',   'Planta de generadores de emergencia',         'Edificio 4, Exterior','operacional'),
    ('Zona I - Control',       'Sala de control central',                     'Edificio 5, Piso 1',  'operacional'),
    ('Zona J - Mantenimiento', 'Área de taller y mantenimiento preventivo',   'Edificio 5, Piso 2',  'inactivo');

-- ------------------------------------------------------------
-- Monitorings
-- Columna current_value:
--   - Filas donde current_value > threshold_value activan alerta
-- ------------------------------------------------------------

INSERT INTO monitorings
    (sensor_id, zone_id, installation_date, reading_type, threshold_value, current_value, status)
VALUES
--  sensor  zona  fecha           tipo           umbral  actual  estado
    (1,      1,    '2023-01-10',  'temperatura',  85.00,  91.50, 'activo'),   -- ALERTA: 91.5 > 85
    (2,      1,    '2023-01-10',  'temperatura',  90.00,  78.20, 'activo'),
    (3,      2,    '2023-03-05',  'presion',    120.00, 134.00, 'activo'),   -- ALERTA: 134 > 120
    (4,      2,    '2023-03-05',  'presion',    110.00, 105.80, 'activo'),
    (5,      4,    '2023-05-20',  'vibracion',     4.50,   5.10, 'activo'),   -- ALERTA: 5.1 > 4.5
    (6,      4,    '2023-05-20',  'vibracion',     5.00,   3.80, 'pausado'),
    (7,      5,    '2023-06-15',  'flujo',        200.00, 198.50, 'activo'),
    (8,      3,    '2023-07-01',  'flujo',        150.00, 162.00, 'activo'),   -- ALERTA: 162 > 150
    (9,      6,    '2023-08-10',  'temperatura',  60.00,  55.00, 'pausado'),
    (10,     7,    '2023-09-22',  'presion',     95.00,  88.40, 'activo'),
    (1,      8,    '2023-10-05',  'temperatura',  75.00,  79.90, 'activo'),   -- ALERTA: 79.9 > 75
    (3,      9,    '2023-11-18',  'presion',    100.00,  97.30, 'activo'),
    (5,      3,    '2024-01-12',  'vibracion',     3.50,   2.10, 'activo'),
    (7,      7,    '2024-02-28',  'flujo',        180.00, 195.00, 'activo'),   -- ALERTA: 195 > 180
    (2,      9,    '2024-03-15',  'temperatura',  70.00,  68.50, 'activo');