# FERREMAS

Arquitectura de microservicios para una plataforma de e-commerce, desarrollada como proyecto académico. Cada servicio tiene su propia responsabilidad, tecnología y base de datos.

## Arquitectura

| Servicio | Tecnología | Responsabilidad |
|---|---|---|
| `auth` | Spring Boot + Spring Security | Autenticación y autorización mediante JWT |
| `productos` | Spring Boot | Gestión del catálogo de productos (arquitectura en capas: Controller → Service → Repository) |
| `pedidos_ms` | Django + Django REST Framework | Gestión de pedidos entre sucursales y de clientes |
| `pagos` | Django + Django REST Framework | Procesamiento de pagos mediante integración con Stripe (Checkout Session) |
| `fronted` | Django | Interfaz web que consume los microservicios anteriores |

## Funcionalidades principales

- Autenticación segura con tokens JWT.
- CRUD completo de productos (crear, leer, actualizar, eliminar y búsqueda), con carga de imágenes.
- Registro y consulta de pedidos, tanto entre sucursales como de clientes finales.
- Checkout de pago real integrado con Stripe (modo test).
- Persistencia de transacciones con estados (pendiente / pagado / fallido).

## Cómo correr el proyecto localmente

Cada microservicio se levanta de forma independiente.

**Servicios Spring Boot (`auth`, `productos`):**
```bash
cd auth
./mvnw spring-boot:run
```

**Servicios Django (`pedidos_ms`, `pagos`, `fronted`):**
```bash
cd pedidos_ms
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Variables de entorno

El servicio `pagos` y el `fronted` requieren una clave de Stripe configurada como variable de entorno (nunca escrita directamente en el código):

**Linux / macOS:**
```bash
export STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
```

**Windows (PowerShell), antes de correr el servidor:**
```powershell
$env:STRIPE_SECRET_KEY="sk_test_tu_clave_aqui"
python manage.py runserver
```

> En Windows esta variable solo dura la sesión actual de la terminal. Para que sea permanente, configurala desde "Variables de entorno del sistema" en el Panel de Control.

## Stack técnico

Spring Boot · Spring Security · JWT · Django · Django REST Framework · Stripe API · PostgreSQL · MySQL · Git

## Estado del proyecto

Proyecto académico funcional en entorno de desarrollo local. Los cinco servicios se ejecutan y se comunican entre sí; no está desplegado en un entorno de producción.
