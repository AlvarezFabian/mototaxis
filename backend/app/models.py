from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Unicode
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(Unicode(100), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(Unicode(150), unique=True, nullable=True, index=True)
    password_hash = Column(Unicode(255), nullable=False)
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
class Driver(Base):
    __tablename__ = "Drivers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=True, index=True)
    name = Column(Unicode(100), nullable=False)
    phone = Column(String(20), nullable=False)
    vehicle = Column(String(20), nullable=False)
    vehicle_model = Column(Unicode(100), nullable=False)
    plate = Column(String(15), nullable=False)
    base_barrio = Column(Unicode(100), nullable=False)
    status = Column(String(20), default="disponible")
    is_online = Column(Boolean, default=True, nullable=False)
    rating = Column(Float, default=5.0)
    trips_count = Column(Integer, default=0)
    intermunicipal = Column(Boolean, default=False)
    services = Column(Unicode(300), nullable=False)


class Order(Base):
    __tablename__ = "Orders"

    id = Column(String(20), primary_key=True, index=True)
    service_type = Column(Unicode(50), nullable=False)
    client_name = Column(Unicode(100), nullable=False)
    client_phone = Column(String(20), nullable=False)
    origin = Column(Unicode(150), nullable=False)
    destination = Column(Unicode(150), nullable=False)
    details = Column(Unicode(500), nullable=True)
    payment = Column(Unicode(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    status = Column(String(20), default="pendiente")
    applicants_count = Column(Integer, default=0)


class Proposal(Base):
    __tablename__ = "Proposals"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(20), ForeignKey("Orders.id"), nullable=False)
    driver_name = Column(Unicode(100), nullable=False)
    driver_plate = Column(String(15), nullable=False)
    proposed_price = Column(Unicode(50), nullable=False)
    estimated_time = Column(Unicode(50), nullable=False)
    created_at = Column(DateTime, server_default=func.now())