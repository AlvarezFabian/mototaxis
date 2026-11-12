"""
Esquemas de validación con Pydantic v2 para la API de MotoRed Sabanalarga.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

#CONDUCTORES

class DriverBase(BaseModel):
    name: str = Field(..., description="Nombre completo del conductor")
    phone: str = Field(..., description="Número celular para contacto WhatsApp")
    vehicle: str = Field("moto", description="'moto' o 'motocarro'")
    vehicleModel: Optional[str] = Field("Estándar", description="Marca y modelo del vehículo")
    plate: str = Field(..., description="Placa oficial del vehículo")
    baseBarrio: str = Field(..., description="Barrio de acopio o residencia en Sabanalarga")

class DriverCreate(DriverBase):
    pass

class DriverResponse(DriverBase):
    id: int
    status: str = "disponible"
    rating: float = 5.0
    tripsCount: int = 0
    intermunicipal: bool = True
    services: List[str] = []

#SOLICITUDES / ÓRDENES

class OrderCreate(BaseModel):
    serviceType: str = Field("Carrera urbana", description="Tipo de servicio")
    clientName: str = Field(..., description="Nombre del solicitante")
    clientPhone: str = Field(..., description="Teléfono celular para WhatsApp")
    origin: str = Field(..., description="Origen o punto de recogida")
    destination: str = Field(..., description="Destino final o entrega")
    details: str = Field("", description="Notas, productos o pasajeros")
    payment: str = Field("Efectivo en mano", description="Forma de pago acordada")
    habeasDataAccepted: bool = Field(True, description="Consentimiento de Ley 1581 de 2012")

class OrderPublicResponse(BaseModel):

    id: str
    serviceType: str
    clientName: str
    maskedPhone: str = "Teléfono oculto por Ley 1581"
    origin: str
    destination: str
    details: str
    payment: str
    createdAt: str
    status: str
    applicantsCount: int

class OrderDetailResponse(BaseModel):
    
    id: str
    serviceType: str
    clientName: str
    clientPhone: str
    origin: str
    destination: str
    details: str
    payment: str
    createdAt: str
    status: str
    applicantsCount: int

#POSTULACIONES DE CONDUCTOR

class ProposalCreate(BaseModel):
    price: Optional[str] = Field("A convenir", description="Tarifa propuesta en COP")
    time: str = Field("5 minutos", description="Tiempo estimado de llegada")
    driverName: str = Field("Carlos Mario Ruiz", description="Nombre del conductor que se postula")
    driverPlate: str = Field("KJL-88F", description="Placa de la moto")

class ProposalResponse(BaseModel):
    success: bool
    orderId: str
    clientName: str
    unmaskedClientPhone: str
    priceProposed: str
    estimatedTime: str
    whatsappUrl: str
    messageText: str

    #ESQUEMAS PARA AUTENTICACION Y MANEJO DE ROLES
     
class UserRegisterRequest(BaseModel):
    fullName: str
    phone: str
    email: Optional[str] = None
    password: str
    role: str
    vehicle: Optional[str] = "moto"
    vehicleModel: Optional[str] = None
    plate: Optional[str] = None
    baseBarrio: Optional[str] = None


class UserLoginRequest(BaseModel):
    identifier: str
    password: str


class AuthenticatedUserResponse(BaseModel):
    id: int
    fullName: str
    phone: str
    email: Optional[str] = None
    role: str
    plate: Optional[str] = None
    vehicle: Optional[str] = None
    baseBarrio: Optional[str] = None


class AuthTokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: AuthenticatedUserResponse

class UserProfileUpdateRequest(BaseModel):
    fullName: str
    phone: str
    email: Optional[str] = None
    vehicle: Optional[str] = None
    vehicleModel: Optional[str] = None
    plate: Optional[str] = None
    baseBarrio: Optional[str] = None