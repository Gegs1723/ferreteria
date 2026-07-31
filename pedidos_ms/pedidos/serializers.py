# pedidos/serializers.py
from rest_framework import serializers
from .models import Pedido, PedidoCliente

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class PedidoClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoCliente
        fields = '__all__'