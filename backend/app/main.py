import json
import os
import random
import urllib.parse
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .auth import (
    create_access_token,
    get_current_user,
    hash_password,
    require_role,
    verify_password,
)
from .database import get_db
from .models import Driver, Order, Proposal, User
from .schemas import (
    AuthenticatedUserResponse,
    AuthTokenResponse,
    DriverCreate,
    DriverResponse,
    OrderCreate,
    OrderPublicResponse,
    ProposalCreate,
    ProposalResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserProfileUpdateRequest,
)

load_dotenv()

app = FastAPI(
    title="MotoRed Sabanalarga API",
    description="API REST para transporte local, mandados y encomiendas en Sabanalarga, Atlantico.",
    version="2.1.0",
)

cors_origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
if not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def format_driver(driver: Driver) -> dict:
    # Adapta las columnas de SQL Server al formato camelCase que consume el frontend
    return {
        "id": driver.id,
        "name": driver.name,
        "phone": driver.phone,
        "vehicle": driver.vehicle,
        "vehicleModel": driver.vehicle_model,
        "plate": driver.plate,
        "baseBarrio": driver.base_barrio,
        "status": driver.status,
        "rating": driver.rating,
        "tripsCount": driver.trips_count,
        "intermunicipal": driver.intermunicipal,
        "services": json.loads(driver.services) if driver.services else [],
    }


def format_public_order(order: Order) -> dict:
    # Enmascara el telefono del cliente en listados publicos para cumplir la Ley 1581
    created_str = order.created_at.strftime("%d/%m %I:%M %p") if order.created_at else "Reciente"
    return {
        "id": order.id,
        "serviceType": order.service_type,
        "clientName": order.client_name,
        "maskedPhone": "Telefono oculto por Ley 1581",
        "origin": order.origin,
        "destination": order.destination,
        "details": order.details,
        "payment": order.payment,
        "createdAt": created_str,
        "status": order.status,
        "applicantsCount": order.applicants_count,
    }


def build_user_profile(user: User, db: Session) -> dict:
    # Construye el perfil del usuario y adjunta datos operativos si es conductor
    profile = {
        "id": user.id,
        "fullName": user.full_name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role,
        "plate": None,
        "vehicle": None,
        "vehicleModel": None,
        "baseBarrio": None,
    }

    if user.role != "driver":
        return profile

    driver = db.query(Driver).filter(Driver.user_id == user.id).first()
    if driver:
        profile["plate"] = driver.plate
        profile["vehicle"] = driver.vehicle
        profile["vehicleModel"] = driver.vehicle_model
        profile["baseBarrio"] = driver.base_barrio

    return profile


@app.put("/api/auth/profile", response_model=AuthenticatedUserResponse, tags=["Autenticacion"])
def update_user_profile(
    payload: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    clean_phone = payload.phone.strip()
    clean_email = (
        payload.email.strip().lower()
        if payload.email and payload.email.strip()
        else None
    )

    phone_in_use = (
        db.query(User)
        .filter(User.phone == clean_phone, User.id != current_user.id)
        .first()
    )
    if phone_in_use:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ese numero de telefono ya esta registrado en otra cuenta.",
        )

    if clean_email:
        email_in_use = (
            db.query(User)
            .filter(User.email == clean_email, User.id != current_user.id)
            .first()
        )
        if email_in_use:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ese correo electronico ya esta registrado en otra cuenta.",
            )

    current_user.full_name = payload.fullName.strip()
    current_user.phone = clean_phone
    current_user.email = clean_email

    # Sincroniza los cambios del vehiculo en la tabla Drivers si el usuario es conductor
    if current_user.role == "driver":
        driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
        if driver:
            vehicle_type = payload.vehicle or driver.vehicle
            is_moto = vehicle_type == "moto"
            services_list = (
                ["Carrera urbana", "Mandado de compra", "Encomienda intermunicipal"]
                if is_moto
                else ["Carrera urbana", "Mandado de compra"]
            )

            driver.name = current_user.full_name
            driver.phone = current_user.phone
            driver.vehicle = vehicle_type
            driver.vehicle_model = (
                payload.vehicleModel.strip()
                if payload.vehicleModel and payload.vehicleModel.strip()
                else ("Motocicleta" if is_moto else "Motocarro")
            )
            if payload.plate and payload.plate.strip():
                driver.plate = payload.plate.upper().strip()
            if payload.baseBarrio and payload.baseBarrio.strip():
                driver.base_barrio = payload.baseBarrio.strip()
            driver.intermunicipal = is_moto
            driver.services = json.dumps(services_list, ensure_ascii=False)

    db.commit()
    db.refresh(current_user)
    return build_user_profile(current_user, db)

@app.get("/", tags=["General"])
def root(db: Session = Depends(get_db)):
    drivers_count = db.query(Driver).count()
    open_orders_count = db.query(Order).filter(Order.status == "pendiente").count()
    return {
        "app": "MotoRed Sabanalarga API",
        "municipio": "Sabanalarga, Atlantico, Colombia",
        "status": "online",
        "storage": "SQL Server Express (MotoRedDB)",
        "driversCount": drivers_count,
        "openOrdersCount": open_orders_count,
    }


@app.post(
    "/api/auth/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Autenticacion"],
)
@app.post(
    "/api/auth/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Autenticacion"],
)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    if payload.role not in ("client", "driver"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El rol debe ser client o driver.",
        )

    clean_phone = payload.phone.strip()
    clean_email = (
        payload.email.strip().lower()
        if payload.email and payload.email.strip()
        else None
    )

    existing_phone = db.query(User).filter(User.phone == clean_phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una cuenta registrada con este numero de telefono.",
        )

    if clean_email:
        existing_email = db.query(User).filter(User.email == clean_email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe una cuenta registrada con este correo electronico.",
            )

    if payload.role == "driver" and (not payload.plate or not payload.baseBarrio):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Los conductores deben registrar placa y barrio base.",
        )

    new_user = User(
        full_name=payload.fullName.strip(),
        phone=clean_phone,
        email=clean_email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(new_user)
    # Obtiene el ID del usuario sin confirmar la transaccion hasta completar todo el registro
    db.flush()

    if payload.role == "driver":
        is_moto = payload.vehicle == "moto"
        services_list = (
            ["Carrera urbana", "Mandado de compra", "Encomienda intermunicipal"]
            if is_moto
            else ["Carrera urbana", "Mandado de compra"]
        )
        new_driver = Driver(
            user_id=new_user.id,
            name=new_user.full_name,
            phone=new_user.phone,
            vehicle=payload.vehicle or "moto",
            vehicle_model=payload.vehicleModel or ("Motocicleta" if is_moto else "Motocarro"),
            plate=payload.plate.upper().strip(),
            base_barrio=payload.baseBarrio.strip(),
            status="disponible",
            rating=5.0,
            trips_count=0,
            intermunicipal=is_moto,
            services=json.dumps(services_list, ensure_ascii=False),
        )
        db.add(new_driver)

    # Guarda usuario y conductor juntos en una sola transaccion atomica
    db.commit()
    db.refresh(new_user)

    token = create_access_token(user_id=new_user.id, role=new_user.role)
    return {
        "accessToken": token,
        "tokenType": "bearer",
        "user": build_user_profile(new_user, db),
    }


@app.post("/api/auth/login", response_model=AuthTokenResponse, tags=["Autenticacion"])
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    clean_identifier = payload.identifier.strip()

    # Permite autenticar al usuario mediante su celular o correo electronico
    user = (
        db.query(User)
        .filter(
            or_(
                User.phone == clean_identifier,
                User.email == clean_identifier.lower(),
            )
        )
        .first()
    )

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Celular, correo o contraseña incorrectos.",
        )

    token = create_access_token(user_id=user.id, role=user.role)
    return {
        "accessToken": token,
        "tokenType": "bearer",
        "user": build_user_profile(user, db),
    }


@app.get("/api/auth/me", response_model=AuthenticatedUserResponse, tags=["Autenticacion"])
def get_authenticated_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return build_user_profile(current_user, db)


@app.get("/api/drivers", response_model=List[DriverResponse], tags=["Conductores"])
def get_drivers(
    barrio: Optional[str] = Query(None, description="Filtrar por barrio o nombre"),
    vehicle: Optional[str] = Query(None, description="Filtrar por tipo: moto o motocarro"),
    status: Optional[str] = Query(None, description="Filtrar por estado: disponible o en_carrera"),
    db: Session = Depends(get_db),
):
    query = db.query(Driver)

    if barrio:
        search_term = f"%{barrio.strip()}%"
        query = query.filter(
            or_(Driver.base_barrio.ilike(search_term), Driver.name.ilike(search_term))
        )

    if vehicle and vehicle != "all":
        query = query.filter(Driver.vehicle == vehicle)

    if status and status != "all":
        query = query.filter(Driver.status == status)

    drivers = query.all()
    return [format_driver(d) for d in drivers]


@app.post(
    "/api/drivers",
    response_model=DriverResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Conductores"],
)
def register_driver(payload: DriverCreate, db: Session = Depends(get_db)):
    is_moto = payload.vehicle == "moto"
    services_list = (
        ["Carrera urbana", "Mandado de compra", "Encomienda intermunicipal"]
        if is_moto
        else ["Carrera urbana", "Mandado de compra"]
    )

    new_driver = Driver(
        name=payload.name,
        phone=payload.phone,
        vehicle=payload.vehicle,
        vehicle_model=payload.vehicleModel or ("Motocicleta" if is_moto else "Motocarro"),
        plate=payload.plate.upper(),
        base_barrio=payload.baseBarrio,
        status="disponible",
        rating=5.0,
        trips_count=0,
        intermunicipal=is_moto,
        services=json.dumps(services_list, ensure_ascii=False),
    )

    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return format_driver(new_driver)


@app.get("/api/orders", response_model=List[OrderPublicResponse], tags=["Bolsa de Pedidos"])
def get_open_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [format_public_order(o) for o in orders]


@app.post(
    "/api/orders",
    response_model=OrderPublicResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Bolsa de Pedidos"],
)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    new_id = f"ORD-{random.randint(100, 999)}"
    while db.query(Order).filter(Order.id == new_id).first():
        new_id = f"ORD-{random.randint(100, 999)}"

    new_order = Order(
        id=new_id,
        service_type=payload.serviceType,
        client_name=payload.clientName,
        client_phone=payload.clientPhone,
        origin=payload.origin,
        destination=payload.destination,
        details=payload.details,
        payment=payload.payment,
        status="pendiente",
        applicants_count=0,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return format_public_order(new_order)


@app.post("/api/orders/{order_id}/apply", response_model=ProposalResponse, tags=["Bolsa de Pedidos"])
def apply_to_order(
    order_id: str,
    proposal: ProposalCreate,
    current_user: User = Depends(require_role("driver")),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La orden {order_id} no existe en la bolsa de pedidos.",
        )

    driver_record = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    driver_name = driver_record.name if driver_record else current_user.full_name
    driver_plate = driver_record.plate if driver_record else proposal.driverPlate.upper()
    price_str = proposal.price or "A convenir"

    new_proposal = Proposal(
        order_id=order.id,
        driver_name=driver_name,
        driver_plate=driver_plate,
        proposed_price=price_str,
        estimated_time=proposal.time,
    )

    order.applicants_count += 1
    db.add(new_proposal)
    db.commit()

    message_text = (
        f"Hola {order.client_name}, te hablo de MotoRed Sabanalarga.\n\n"
        f"Me postulo para atender tu solicitud #{order.id} ({order.service_type}).\n"
        f"Tarifa propuesta: ${price_str} COP\n"
        f"Tiempo estimado de llegada: {proposal.time}\n"
        f"Conductor: {driver_name} (Placa {driver_plate})\n\n"
        f"Confirmamos el servicio?"
    )

    clean_phone = "".join(filter(str.isdigit, order.client_phone))
    if not clean_phone.startswith("57"):
        clean_phone = f"57{clean_phone}"

    encoded_text = urllib.parse.quote(message_text)
    whatsapp_url = f"https://wa.me/{clean_phone}?text={encoded_text}"

    return {
        "success": True,
        "orderId": order.id,
        "clientName": order.client_name,
        "unmaskedClientPhone": order.client_phone,
        "priceProposed": price_str,
        "estimatedTime": proposal.time,
        "whatsappUrl": whatsapp_url,
        "messageText": message_text,
    }