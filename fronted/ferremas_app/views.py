from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import requests
import json
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
import stripe
from django.contrib import messages

import os
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

def inicio(request):
    print("Nombre en sesión:", request.session.get('usuario_nombre'))
    return render(request, 'HTML/inicio.html')

# PRODUCTOS
def acabados(request):
    return render(request, 'HTML/productos/acabados.html')

def accesorios_varios(request):
    return render(request, 'HTML/productos/accesorios_varios.html')

def arena(request):
    return render(request, 'HTML/productos/arena.html')

def barnices(request):
    return render(request, 'HTML/productos/barnices.html')

def cascos(request):
    return render(request, 'HTML/productos/cascos.html')

def cemento(request):
    return render(request, 'HTML/productos/cemento.html')

def ceramicos(request):
    return render(request, 'HTML/productos/ceramicos.html')

def destornilladores(request):
    return render(request, 'HTML/productos/destornilladores.html')

def equipos_medicion(request):
    return render(request, 'HTML/productos/equipos_medicion.html')

def equipos_seguridad(request):
    return render(request, 'HTML/productos/equipos_seguridad.html')

def fijaciones_adhesivos(request):
    return render(request, 'HTML/productos/fijaciones_adhesivos.html')

def guantes(request):
    return render(request, 'HTML/productos/guantes.html')

def herramientas_electricas(request):
    return render(request, 'HTML/productos/herramientas_electricas.html')

def herramientas_manuales(request):
    return render(request, 'HTML/productos/herramientas_manuales.html')

def ladrillos(request):
    return render(request, 'HTML/productos/ladrillos.html')

def lentes_seguridad(request):
    return render(request, 'HTML/productos/lentes_seguridad.html')

def lijadoras(request):
    return render(request, 'HTML/productos/lijadoras.html')

def llaves(request):
    return render(request, 'HTML/productos/llaves.html')

def martillos(request):
    return render(request, 'HTML/productos/martillos.html')

def materiales_basicos(request):
    return render(request, 'HTML/productos/materiales_basicos.html')

def materiales_construccion(request):
    return render(request, 'HTML/productos/materiales_construccion.html')

def pinturas(request):
    return render(request, 'HTML/productos/pinturas.html')

def sierras(request):
    return render(request, 'HTML/productos/sierras.html')

def taladros(request):
    return render(request, 'HTML/productos/taladros.html')

def tornillos_anchajes(request):
    return render(request, 'HTML/productos/tornillos_anchajes.html')

# PEDIDOS
def registrar_pedido(request):
    # Solo el bodeguero puede registrar pedidos
    if request.session.get('usuario_rol') != "BODEGUERO":
        return redirect('inicio')
    mensaje = ""
    if request.method == "POST":
        data = {
            "sucursal_origen": request.POST.get("sucursal_origen"),
            "sucursal_destino": request.POST.get("sucursal_destino"),
            "productos": [
                {"codigo": request.POST.get("codigo1"), "cantidad": int(request.POST.get("cantidad1"))},
                {"codigo": request.POST.get("codigo2"), "cantidad": int(request.POST.get("cantidad2"))}
            ],
            "observaciones": request.POST.get("observaciones")
        }
        response = requests.post('http://localhost:8001/pedidos', json=data)
        if response.status_code == 201:
            mensaje = "¡Pedido registrado correctamente!"
        else:
            mensaje = "Error al registrar el pedido."
    return render(request, "HTML/pedidos/registrar_pedido.html", {"mensaje": mensaje})

def ver_pedidos(request):
    if request.session.get('usuario_rol') not in ["VENDEDOR", "BODEGUERO"]:
        return redirect('inicio')
    try:
        response = requests.get('http://localhost:8001/pedidos')
        pedidos = response.json() if response.status_code == 200 else []
    except Exception:
        pedidos = []
    return render(request, "HTML/pedidos/ver_pedidos.html", {
        "pedidos": pedidos,
        "rol": request.session.get('usuario_rol')
    })

def pago_exitoso(request):
    """
    Vista que se llama después de que Stripe confirma el pago.
    Registra el pedido en el microservicio y limpia el carrito.
    """
    carrito = request.session.get('carrito', [])
    direccion = request.session.get('direccion', '')
    if not direccion:
        direccion = "Dirección de prueba 123"  # <--- SOLO PARA PRUEBAS
    tipo_pago = request.session.get('tipo_pago', 'stripe')
    datos_pago = request.session.get('datos_pago', {})  # Si tienes info de Stripe

    usuario = request.session.get('usuario_email') or request.session.get('usuario_nombre') or "cliente@correo.com"

    pedido_registrado = False
    print("DEBUG pago_exitoso - carrito:", carrito)
    print("DEBUG pago_exitoso - usuario:", usuario)
    print("DEBUG pago_exitoso - direccion:", direccion)
    print("DEBUG pago_exitoso - tipo_pago:", tipo_pago)

    # Estructura para la boleta JS
    detalle_pago = None
    if carrito:
        total = sum((item.get("precio_unitario") or item.get("price", 0)) * item.get("cantidad", 1) for item in carrito)
        detalle_pago = {
            "carrito": [
                {
                    "id": item.get("id") or item.get("codigo"),
                    "name": item.get("nombre") or item.get("name"),
                    "price": item.get("precio_unitario") or item.get("price"),
                    "cantidad": item.get("cantidad"),
                }
                for item in carrito
            ],
            "total": total
        }

    if carrito and usuario and direccion and tipo_pago:
        productos = [
            {
                "codigo": item.get("id") or item.get("codigo"),
                "nombre": item.get("nombre") or item.get("name"),
                "cantidad": item.get("cantidad"),
                "precio_unitario": item.get("precio_unitario") or item.get("price"),
            }
            for item in carrito
        ]
        total = sum(item["cantidad"] * item["precio_unitario"] for item in carrito)
        pedido_data = {
            "usuario": usuario,
            "productos": productos,
            "total": total,
            "direccion": direccion,
            "tipo_pago": tipo_pago,
            "estado": "pagado",
            "datos_pago": datos_pago,
        }
        print("Pedido a enviar:", json.dumps(pedido_data, indent=2, ensure_ascii=False))
        try:
            resp = requests.post("http://localhost:8001/api/pedidos_cliente/", json=pedido_data, timeout=5)
            print("Respuesta microservicio pedidos:", resp.status_code, resp.text)
            if resp.status_code in (200, 201):
                pedido_registrado = True
            else:
                print("Error al registrar pedido:", resp.status_code, resp.text)
        except Exception as e:
            print("Error registrando pedido:", e)

        # Limpia el carrito solo si el pedido fue registrado
        if pedido_registrado:
            if 'carrito' in request.session:
                del request.session['carrito']

    return render(request, 'HTML/pedidos/pago_exitoso.html', {
        "carrito": carrito,
        "direccion": direccion,
        "tipo_pago": tipo_pago,
        "pedido_registrado": pedido_registrado,
        "detalle_pago": json.dumps(detalle_pago) if detalle_pago else None,
    })

def pago_erroneo(request):
    return render(request, 'HTML/pedidos/pago_error.html', {
        "mensaje": "Hubo un error con el pago. Por favor, inténtalo de nuevo."
    })

def pagos(request):
    return redirect('lista_pedidos')

def compras(request):
    return render(request, 'HTML/pedidos/compras.html')

# CARRITO
def carrito(request):
    return render(request, 'HTML/carrito/carrito.html')

# BUSQUEDA
def resultados_busqueda(request):
    # Puedes pasar el término de búsqueda si lo necesitas
    query = request.GET.get('q', '')
    return render(request, 'HTML/busqueda/resultados_busqueda.html', {'query': query})

# ADMIN
def crud(request):
    if request.session.get('usuario_rol') not in ["ADMIN", "BODEGUERO"]:
        return redirect('inicio')
    return render(request, 'HTML/admin/crud.html')

def crud_usuarios(request):
    if request.session.get('usuario_rol') != "ADMIN":
        return redirect('inicio')
    try:
        respuesta = requests.get("http://localhost:8084/api/auth/usuarios", timeout=5)
        if respuesta.status_code == 200:
            usuarios = respuesta.json()
        else:
            usuarios = []
    except Exception as e:
        usuarios = []
    return render(request, 'HTML/admin/crud_usuarios.html', {'usuarios': usuarios})

def usuario_crear(request):
    if request.method == "POST":
        datos = {
            "nombre": request.POST.get("nombre"),
            "apellido": request.POST.get("apellido"),
            "email": request.POST.get("email"),
            "password": request.POST.get("password"),
            "telefono": request.POST.get("telefono"),
            "fechaNacimiento": request.POST.get("fecha_nacimiento"),
            "direccion": request.POST.get("direccion"),
            "tipoCliente": request.POST.get("tipo_cliente"),
            "newsletter": request.POST.get("newsletter") == "on",
            "rol": request.POST.get("rol"),
        }
        requests.post("http://localhost:8084/api/auth/registro", json=datos)
        return redirect(reverse('crud_usuarios'))
    return render(request, "HTML/admin/usuario_form.html", {"accion": "Crear"})

def usuario_editar(request, usuario_id):
    usuario = requests.get(f"http://localhost:8084/api/auth/usuarios/{usuario_id}").json()
    if request.method == "POST":
        datos = {
            "nombre": request.POST.get("nombre"),
            "apellido": request.POST.get("apellido"),
            "email": request.POST.get("email"),
            "telefono": request.POST.get("telefono"),
            "fechaNacimiento": request.POST.get("fecha_nacimiento"),
            "direccion": request.POST.get("direccion"),
            "tipoCliente": request.POST.get("tipo_cliente"),
            "newsletter": request.POST.get("newsletter") == "on",
        }
        requests.put(f"http://localhost:8084/api/auth/usuarios/{usuario_id}", json=datos)
        return redirect(reverse('crud_usuarios'))
    return render(request, "HTML/admin/usuario_form.html", {"usuario": usuario, "accion": "Editar"})

def usuario_eliminar(request, usuario_id):
    requests.delete(f"http://localhost:8084/api/auth/usuarios/{usuario_id}")
    return redirect(reverse('crud_usuarios'))

# BASE
def base(request):
    return render(request, 'base.html')

@csrf_exempt
def webpay_callback(request):
    if request.method == "POST":
        print("Webhook recibido:", request.body)
        # Aquí puedes actualizar el pedido en tu base de datos
        return JsonResponse({"status": "ok"})
    return JsonResponse({"error": "Método no permitido"}, status=405)

def registrar_usuario(request):
    mensaje = None
    exito = False
    if request.method == "POST":
        datos = {
            "nombre": request.POST.get("nombre"),
            "apellido": request.POST.get("apellido"),
            "email": request.POST.get("email"),
            "password": request.POST.get("password"),
            "telefono": request.POST.get("telefono"),
            "fecha_nacimiento": request.POST.get("fecha_nacimiento"),
            "direccion": request.POST.get("direccion"),
            "tipo_cliente": request.POST.get("tipo_cliente"),
        }
        url = "http://localhost:8084/api/usuarios"
        respuesta = requests.post(url, json=datos)
        if respuesta.status_code == 200:
            mensaje = "Usuario creado correctamente. Ahora puedes iniciar sesión."
            exito = True
        else:
            mensaje = "Error al crear usuario: " + respuesta.text
    return render(request, "HTML/usuarios/registrate.html", {"mensaje": mensaje, "exito": exito})

def iniciar_sesion(request):
    mensaje = None
    if request.method == 'POST':
        data = {
            "email": request.POST.get('email'),
            "password": request.POST.get('password')
        }
        try:
            response = requests.post(
                "http://localhost:8084/api/auth/login",
                json=data,
                timeout=5
            )
            if response.status_code == 200:
                respuesta_json = response.json()
                token = respuesta_json.get('token')
                nombre = respuesta_json.get('nombre')
                email = respuesta_json.get('email')
                rol = respuesta_json.get('rol')
                request.session['jwt'] = token
                if nombre:
                    request.session['usuario_nombre'] = nombre
                if email:
                    request.session['usuario_email'] = email
                request.session['usuario_rol'] = rol
                return redirect('inicio')
            else:
                mensaje = response.json().get('error', 'Credenciales inválidas.')
        except Exception as e:
            mensaje = f"Error de conexión: {e}"
    return render(request, 'HTML/usuarios/iniciar_sesion.html', {'mensaje': mensaje})

@csrf_exempt
def cerrar_sesion(request):
    request.session.flush()
    return JsonResponse({"ok": True})

def registrate(request):
    mensaje = None
    exito = False
    if request.method == 'POST':
        data = {
            "nombre": request.POST.get('nombre'),
            "apellido": request.POST.get('apellido'),
            "email": request.POST.get('email'),
            "password": request.POST.get('password'),
            "telefono": request.POST.get('telefono'),
            "fechaNacimiento": request.POST.get('fecha_nacimiento'),
            "direccion": request.POST.get('direccion'),
            "tipoCliente": request.POST.get('tipo_cliente'),
            "newsletter": request.POST.get('newsletter') == "on",
        }
        try:
            response = requests.post(
                "http://localhost:8084/api/auth/registro",
                json=data,
                timeout=5
            )
            if response.status_code == 200:
                mensaje = "¡Registro exitoso! Ahora puedes iniciar sesión."
                exito = True
            else:
                mensaje = response.json().get('error', 'Error en el registro.')
        except Exception as e:
            mensaje = f"Error de conexión: {e}"
    return render(request, 'HTML/usuarios/registrate.html', {'mensaje': mensaje, 'exito': exito})

def vista_admin(request):
    if request.session.get('usuario_rol') != "ADMIN":
        return redirect('inicio')
    # ... lógica de administrador ...

def vista_vendedor(request):
    if request.session.get('usuario_rol') != "VENDEDOR":
        return redirect('inicio')
    # ... lógica de vendedor ...

def vista_bodeguero(request):
    if request.session.get('usuario_rol') != "BODEGUERO":
        return redirect('inicio')
    # ... lógica de bodeguero ...

def vista_contador(request):
    if request.session.get('usuario_rol') != "CONTADOR":
        return redirect('inicio')
    # ... lógica de contador ...

# --- SINCRONIZAR SESIÓN PARA LOGIN JS ---
@csrf_exempt
def sincronizar_sesion(request):
    if request.method == "POST":
        data = json.loads(request.body)
        if 'nombre' in data:
            request.session['usuario_nombre'] = data.get('nombre')
        if 'rol' in data:
            request.session['usuario_rol'] = data.get('rol')
        if 'email' in data:
            request.session['usuario_email'] = data.get('email')
        if 'carrito' in data:
            request.session['carrito'] = data['carrito']
        if 'direccion' in data:
            request.session['direccion'] = data['direccion']
        if 'tipo_pago' in data:
            request.session['tipo_pago'] = data['tipo_pago']
        if 'tipo_entrega' in data:
            request.session['tipo_entrega'] = data['tipo_entrega']
        return JsonResponse({"ok": True})
    return JsonResponse({"error": "Método no permitido"}, status=405)

def lista_pedidos(request):
    usuario_rol = request.session.get('usuario_rol')
    usuario_email = request.session.get('usuario_email')
    pedidos_cliente = []
    pedidos_por_aprobar = []
    pedidos_bodega = []
    pedidos_contador = []

    if usuario_rol == "CLIENTE":
        try:
            response = requests.get(f'http://localhost:8001/api/pedidos_cliente/?email={usuario_email}')
            if response.status_code == 200:
                pedidos_cliente = response.json()
        except Exception:
            pedidos_cliente = []
    elif usuario_rol == "VENDEDOR":
        try:
            response = requests.get('http://localhost:8001/api/pedidos_cliente/')
            if response.status_code == 200:
                todos = response.json()
                pedidos_por_aprobar = [p for p in todos if p.get('estado') in ['pendiente', 'por_aprobar', 'entregado_a_vendedor']]
        except Exception:
            pedidos_por_aprobar = []
    elif usuario_rol == "BODEGUERO":
        try:
            response = requests.get('http://localhost:8001/api/pedidos_cliente/')
            if response.status_code == 200:
                todos = response.json()
                pedidos_bodega = [p for p in todos if p.get('estado') in ['aprobado', 'preparacion']]
        except Exception:
            pedidos_bodega = []
    elif usuario_rol == "CONTADOR":
        try:
            response = requests.get('http://localhost:8001/api/pedidos_cliente/')
            if response.status_code == 200:
                todos = response.json()
                pedidos_contador = [p for p in todos if p.get('estado') in ['pagado', 'entregado', 'pendiente_pago']]
        except Exception:
            pedidos_contador = []

    return render(request, "HTML/pedidos/lista_pedidos.html", {
        "usuario_rol": usuario_rol,
        "pedidos_cliente": pedidos_cliente,
        "pedidos_por_aprobar": pedidos_por_aprobar,
        "pedidos_bodega": pedidos_bodega,
        "pedidos_contador": pedidos_contador,
    })

@csrf_exempt
def aprobar_pedido(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "VENDEDOR":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "aprobado"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Pedido aprobado correctamente.")
            else:
                messages.error(request, "No se pudo aprobar el pedido.")
        except Exception as e:
            messages.error(request, f"Error al aprobar pedido: {e}")
    return redirect('lista_pedidos')

@csrf_exempt
def rechazar_pedido(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "VENDEDOR":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "rechazado"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Pedido rechazado correctamente.")
            else:
                messages.error(request, "No se pudo rechazar el pedido.")
        except Exception as e:
            messages.error(request, f"Error al rechazar pedido: {e}")
    return redirect('lista_pedidos')

@csrf_exempt
def preparar_pedido(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "BODEGUERO":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "preparacion"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Pedido puesto en preparación correctamente.")
            else:
                messages.error(request, "No se pudo poner el pedido en preparación.")
        except Exception as e:
            messages.error(request, f"Error al preparar pedido: {e}")
    return redirect('lista_pedidos')

@csrf_exempt
def entregar_a_vendedor(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "BODEGUERO":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "entregado_a_vendedor"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Pedido entregado al vendedor correctamente.")
            else:
                messages.error(request, "No se pudo entregar el pedido al vendedor.")
        except Exception as e:
            messages.error(request, f"Error al entregar a vendedor: {e}")
    return redirect('lista_pedidos')

@csrf_exempt
def confirmar_pago(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "CONTADOR":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "aprobado"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Pago confirmado correctamente.")
            else:
                messages.error(request, "No se pudo confirmar el pago.")
        except Exception as e:
            messages.error(request, f"Error al confirmar pago: {e}")
    return redirect('lista_pedidos')

@csrf_exempt
def registrar_entrega(request, pedido_id):
    if request.method == "POST" and request.session.get('usuario_rol') == "CONTADOR":
        try:
            resp = requests.patch(
                f'http://localhost:8001/api/pedidos_cliente/{pedido_id}/',
                json={"estado": "entregado"},
                timeout=5
            )
            if resp.status_code == 200:
                messages.success(request, "Entrega registrada correctamente.")
            else:
                messages.error(request, "No se pudo registrar la entrega.")
        except Exception as e:
            messages.error(request, f"Error al registrar entrega: {e}")
    return redirect('lista_pedidos')

def en_construccion(request):
    return render(request, "HTML/en_construccion.html")

@csrf_exempt
def stripe_checkout(request):
    if request.method == "POST":
        carrito = request.session.get('carrito', [])
        usuario_email = request.session.get('usuario_email', '')
        if not carrito:
            return JsonResponse({'error': 'Carrito vacío'}, status=400)
        line_items = []
        for item in carrito:
            line_items.append({
                'price_data': {
                    'currency': 'clp',
                    'product_data': {'name': item.get('nombre') or item.get('name')},
                    'unit_amount': int(item.get('precio_unitario', item.get('price', 0)) * 100),
                },
                'quantity': item.get('cantidad', 1),
            })
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            customer_email=usuario_email,
            success_url=request.build_absolute_uri('/pago_exitoso/'),
            cancel_url=request.build_absolute_uri('/carrito/'),
        )
        return JsonResponse({'url': session.url})
    return JsonResponse({'error': 'Método no permitido'}, status=405)




