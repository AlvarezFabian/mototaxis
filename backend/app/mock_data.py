from typing import List, Dict, Any

MOCK_DRIVERS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Carlos Mario Ruiz",
        "phone": "3004567890",
        "vehicle": "moto",
        "vehicleModel": "Yamaha YCZ 110",
        "plate": "KJL-88F",
        "baseBarrio": "Barrio Centro",
        "status": "disponible",
        "rating": 4.9,
        "tripsCount": 142,
        "intermunicipal": True,
        "services": ["Carrera urbana", "Mandado de compra", "Encomienda intermunicipal"]
    },
    {
        "id": 2,
        "name": "José David Pérez",
        "phone": "3119876543",
        "vehicle": "moto",
        "vehicleModel": "Bajaj Boxer CT 100",
        "plate": "HGF-12D",
        "baseBarrio": "Barrio 7 de Agosto",
        "status": "disponible",
        "rating": 4.8,
        "tripsCount": 98,
        "intermunicipal": False,
        "services": ["Carrera urbana", "Mandado de compra"]
    },
    {
        "id": 3,
        "name": "Nelson Gutiérrez",
        "phone": "3023456789",
        "vehicle": "motocarro",
        "vehicleModel": "RE Auteco Carga",
        "plate": "MTC-454",
        "baseBarrio": "Plaza de Mercado",
        "status": "disponible",
        "rating": 5.0,
        "tripsCount": 215,
        "intermunicipal": False,
        "services": ["Carrera urbana", "Mandado de compra"]
    },
    {
        "id": 4,
        "name": "Andrés Felipe Blanco",
        "phone": "3145678901",
        "vehicle": "moto",
        "vehicleModel": "TVS HLX 150",
        "plate": "POU-90E",
        "baseBarrio": "Avenida San Antonio",
        "status": "en_carrera",
        "rating": 4.7,
        "tripsCount": 84,
        "intermunicipal": True,
        "services": ["Carrera urbana", "Encomienda intermunicipal"]
    },
    {
        "id": 5,
        "name": "Jorge Eliécer Mercado",
        "phone": "3056789012",
        "vehicle": "moto",
        "vehicleModel": "Suzuki AX 100",
        "plate": "TRE-33C",
        "baseBarrio": "Nevada de buses",
        "status": "disponible",
        "rating": 4.9,
        "tripsCount": 176,
        "intermunicipal": True,
        "services": ["Carrera urbana", "Encomienda intermunicipal"]
    }
]

MOCK_ORDERS: List[Dict[str, Any]] = [
    {
        "id": "ORD-201",
        "serviceType": "Carrera urbana",
        "clientName": "María F.",
        "clientPhone": "3001112233",
        "origin": "Barrio Centro (Cerca al Banco Agrario)",
        "destination": "Barrio 7 de Agosto (Por la cancha)",
        "details": "1 Pasajero con bolso personal. Salida inmediata.",
        "payment": "Transferencia Nequi",
        "createdAt": "Hace 4 min",
        "status": "pendiente",
        "applicantsCount": 1
    },
    {
        "id": "ORD-202",
        "serviceType": "Mandado de compra",
        "clientName": "Roberto G.",
        "clientPhone": "3124445566",
        "origin": "Plaza de Mercado (Sector carnes)",
        "destination": "Barrio San Antonio (Frente al parque)",
        "details": "Comprar 2.5 kg de lomo de res y 1 lb de suero.",
        "payment": "Efectivo en mano",
        "createdAt": "Hace 11 min",
        "status": "pendiente",
        "applicantsCount": 0
    },
    {
        "id": "ORD-203",
        "serviceType": "Encomienda intermunicipal",
        "clientName": "Diana M.",
        "clientPhone": "3109988776",
        "origin": "Nevada de buses (Calle 21)",
        "destination": "Barranquilla (Calle 72 # 45-10)",
        "details": "Paquete: Caja mediana con repuestos (3kg). Recibe: Pedro Ruiz (3109876543)",
        "payment": "Transferencia Daviplata",
        "createdAt": "Hace 18 min",
        "status": "pendiente",
        "applicantsCount": 0
    }
]
