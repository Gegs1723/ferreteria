from django.db import models

# Create your models here.

class Pedido(models.Model):
    sucursal_origen = models.CharField(max_length=100)
    sucursal_destino = models.CharField(max_length=100)
    productos = models.JSONField()  # Lista de productos y cantidades
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default='pendiente')
    observaciones = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Pedido de {self.sucursal_origen} a {self.sucursal_destino} ({self.fecha})"

# --- NUEVO MODELO ---
class PedidoCliente(models.Model):
    usuario = models.CharField(max_length=150)  # nombre o email del cliente
    productos = models.JSONField()  # [{codigo, nombre, cantidad, precio_unitario}]
    total = models.DecimalField(max_digits=12, decimal_places=2)
    direccion = models.CharField(max_length=255)
    fecha = models.DateTimeField(auto_now_add=True)
    tipo_pago = models.CharField(max_length=50)  # Ej: 'visa', 'mastercard', 'debito', etc.
    estado = models.CharField(max_length=50, default='pagado')
    datos_pago = models.JSONField(blank=True, null=True)  # Para guardar info extra de Stripe si lo deseas

    def __str__(self):
        return f"PedidoCliente de {self.usuario} ({self.fecha}) - Total: {self.total}"
