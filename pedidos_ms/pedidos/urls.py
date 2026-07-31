# pedidos/urls.py
from django.urls import path
from .views import PedidoListCreateView, pedidos_cliente, TodosPedidosView, actualizar_estado_pedido_cliente

urlpatterns = [
    path('pedidos/', PedidoListCreateView.as_view(), name='pedidos_sucursales'),
    path('api/pedidos_cliente/', pedidos_cliente, name='pedidos_cliente'),
    path('api/pedidos_todos/', TodosPedidosView.as_view(), name='pedidos_todos'),
    path('api/pedidos_cliente/<int:pedido_id>/', actualizar_estado_pedido_cliente, name='actualizar_estado_pedido_cliente'),
]