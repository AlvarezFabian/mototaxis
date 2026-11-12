import os
import urllib
import pyodbc
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DB_SERVER = os.getenv("DB_SERVER", r".\SQLEXPRESS")
DB_NAME = os.getenv("DB_NAME", "MotoRedDB")


def get_installed_driver() -> str:
    # Detecta el controlador ODBC de SQL Server disponible en Windows
    drivers = [driver for driver in pyodbc.drivers() if "SQL Server" in driver]
    return drivers[-1] if drivers else "ODBC Driver 17 for SQL Server"


driver_name = get_installed_driver()

connection_string = (
    f"DRIVER={{{driver_name}}};"
    f"SERVER={DB_SERVER};"
    f"DATABASE={DB_NAME};"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

params = urllib.parse.quote_plus(connection_string)
DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    # Entrega una sesión de base de datos por petición y la cierra al terminar
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()