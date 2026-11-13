# MotoRed - Plataforma de Movilidad Local y Mandados

MotoRed es una aplicación web full-stack diseñada para conectar pasajeros, comercios y conductores de motocicleta en municipios y pequeñas ciudades. A diferencia de las plataformas tradicionales de transporte con algoritmos cerrados, MotoRed digitaliza la dinámica real de la movilidad local: permite publicar carreras urbanas, mandados o encomiendas abiertas para recibir ofertas directas de tarifa por parte de conductores disponibles, o contactar directamente a un conductor del directorio.

## Problema y Propuesta de Valor

En municipios y pequeñas ciudades, el transporte en motocicleta y los mandados diarios (compras rápidas, pagos de servicios y entregas entre barrios) son fundamentales para la economía cotidiana, pero suelen coordinarse de manera informal y sin trazabilidad.

MotoRed resuelve esta necesidad ofreciendo:

- **Negociación transparente:** Los clientes publican su solicitud y los conductores activos postulan su tarifa propuesta.
- **Enfoque en mandados y encomiendas:** Flujos dedicados tanto para traslado de pasajeros como para diligencias y envíos locales.
- **Experiencia Mobile-First:** Interfaz ligera, rápida y pensada para usarse cómodamente desde el teléfono móvil.

## Características Principales

### Autenticación y Seguridad
- Registro e inicio de sesión unificado con validación de datos y aceptación de políticas de tratamiento de datos (Habeas Data).
- Autenticación basada en JWT (JSON Web Tokens) y cifrado de contraseñas con `bcrypt`.
- Control de acceso y vistas dinámicas según el rol del usuario (Cliente o Conductor).

### Módulo del Cliente
- **Publicación de Solicitudes Abiertas:** Creación rápida de carreras urbanas, mandados o envíos indicando origen, destino y detalles.
- **Directorio de Conductores:** Consulta de conductores registrados con información de vehículo, placa y contacto.
- **Gestión de Perfil:** Actualización de datos personales y de contacto persistidos en base de datos.

### Módulo del Conductor
- **Radar de Solicitudes:** Visualización en tiempo real de las órdenes abiertas publicadas por los clientes.
- **Postulación con Tarifa:** Envío de propuestas económicas directamente sobre las solicitudes disponibles.
- **Panel de Control:** Indicador de estado operativo y gestión de información personal y del vehículo.

## Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Context API |
| **Backend** | Python, FastAPI, SQLAlchemy, Pydantic, PyJWT, Passlib/Bcrypt |
| **Base de Datos** | Microsoft SQL Server |
| **Control de Versiones** | Git, GitHub |

## Estructura del Proyecto

```text
mototaxis/
├── backend/
│   ├── app/
│   │   ├── auth.py          # Generación de tokens JWT y hashing de contraseñas
│   │   ├── database.py      # Configuración de conexión a SQL Server
│   │   ├── main.py          # Endpoints de la API REST y reglas de negocio
│   │   ├── mock_data.py     # Datos iniciales de prueba
│   │   ├── models.py        # Modelos relacionales SQLAlchemy
│   │   └── schemas.py       # Esquemas de validación Pydantic
│   └── requirements.txt     # Dependencias de Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes separados por dominio (auth, client, driver, layout, modals, profile)
│   │   ├── context/         # Estado global de sesión, navegación y órdenes
│   │   ├── services/        # Integraciones externas (contacto directo)
│   │   └── utils/           # Utilidades y políticas de datos
│   └── package.json         # Dependencias de Node.js
└── .gitignore
```

## Instalación y Ejecución Local

### Requisitos Previos
- Python 3.10 o superior
- Node.js 18 o superior
- Instancia activa de Microsoft SQL Server

### 1. Configuración del Backend

```bash
cd backend
python -m venv venv

# Activar entorno virtual en Windows:
venv\Scripts\activate

# Instalar dependencias:
pip install -r requirements.txt
```

Crea un archivo `.env` dentro de la carpeta `backend/` con tus credenciales locales:

```env
DATABASE_URL=mssql+pyodbc://usuario:password@servidor/MotoRedDB?driver=ODBC+Driver+17+for+SQL+Server
SECRET_KEY=tu_clave_secreta_jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Inicia el servidor de desarrollo:

```bash
uvicorn app.main:app --reload
```

La documentación interactiva de la API quedará disponible en `http://localhost:8000/docs`.

### 2. Configuración del Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```

La aplicación web quedará disponible en `http://localhost:5173`.

## Hoja de Ruta (Próximas Mejoras)

- [ ] Persistencia del estado de disponibilidad del conductor (`is_online`) en SQL Server.
- [ ] Vista dedicada de solicitudes activas e historial para el cliente.
- [ ] Aceptación de postulación y flujo completo de estados de la orden (`abierta`, `asignada`, `en_curso`, `completada`).
- [ ] Sistema de calificación post-servicio y directorio filtrable por zona.

## Autor

**Fabian Andres Alvarez Cuadrado**  
Desarrollador Full-Stack Junior