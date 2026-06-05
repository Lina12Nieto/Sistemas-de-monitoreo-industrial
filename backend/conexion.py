import psycopg2

try:
    connection = psycopg2.connect(
        host="db-monitoreo.c6buya8gcs1m.us-east-1.rds.amazonaws.com",
        database="postgres",
        user="sistema",
        password="TU_CONTRASEÑA_AQUÍ",  # Reemplaza con tu clave real
        port="5432"
    )
    cursor = connection.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print(True)
    print(f"¡Conexión exitosa a AWS RDS! Versión: {db_version[0]}")

    cursor.close()
    connection.close()

except Exception as error:
    print(f"Error al conectar: {error}")
import psycopg2

try:
    connection = psycopg2.connect(
        host="dpg-d8hfnir7uimc73cvfrcg-a.oregon-postgres.render.com",
        database="db_sistema_monitoreo",
        user="sistema",
        password="yPmuexP5rkuEwjD0fjPJYEMQlEeTi4Uq",  # Reemplaza con tu clave real
        port="5432"
    )
    cursor = connection.cursor()
    cursor.execute("SELECT version();")
    db_version = cursor.fetchone()
    print(True)
    print(f"¡Conexión exitosa {db_version[0]}")

    cursor.close()
    connection.close()

except Exception as error:
    print(f"Error al conectar: {error}")
