from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Pedido, PedidoCliente
from .serializers import PedidoSerializer, PedidoClienteSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from rest_framework.decorators import api_view

# --- ENDPOINT: Pedidos entre sucursales ---
class PedidoListCreateView(APIView):
    def get(self, request):
        pedidos = Pedido.objects.all().order_by('-fecha')
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- ENDPOINT: Pedidos de clientes (por email o todos) ---
@csrf_exempt
def pedidos_cliente(request):
    if request.method == "GET":
        email = request.GET.get("email")
        if email:
            pedidos = PedidoCliente.objects.filter(usuario=email).order_by('-fecha')
        else:
            pedidos = PedidoCliente.objects.all().order_by('-fecha')
        serializer = PedidoClienteSerializer(pedidos, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        serializer = PedidoClienteSerializer(data=data)
        if serializer.is_valid():
            pedido = serializer.save()
            return JsonResponse({"status": "ok", "id": pedido.id})
        else:
            return JsonResponse({"status": "error", "errors": serializer.errors}, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)

# --- ENDPOINT: Todos los pedidos (clientes + sucursales) ---
class TodosPedidosView(APIView):
    def get(self, request):
        pedidos_clientes = PedidoCliente.objects.all().order_by('-fecha')
        pedidos_sucursales = Pedido.objects.all().order_by('-fecha')
        data = {
            "pedidos_clientes": PedidoClienteSerializer(pedidos_clientes, many=True).data,
            "pedidos_sucursales": PedidoSerializer(pedidos_sucursales, many=True).data,
        }
        return Response(data)

@api_view(['PATCH'])
def actualizar_estado_pedido_cliente(request, pedido_id):
    try:
        pedido = PedidoCliente.objects.get(id=pedido_id)
    except PedidoCliente.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)
    estado = request.data.get("estado")
    if estado:
        pedido.estado = estado
        pedido.save()
        return Response({"status": "ok"})
    return Response({"error": "Estado no proporcionado"}, status=400)
