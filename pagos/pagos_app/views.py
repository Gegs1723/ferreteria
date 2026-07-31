from django.shortcuts import render
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TransaccionPago
from django.http import JsonResponse
import os
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')


class CrearCheckoutStripe(APIView):
    def post(self, request):
        carrito = request.data.get('carrito', [])
        email = request.data.get('email')
        if not carrito or not email:
            return Response({'error': 'Datos incompletos'}, status=400)
        try:
            line_items = []
            for item in carrito:
                line_items.append({
                    'price_data': {
                        'currency': 'clp',
                        'product_data': {
                            'name': item['name'],
                        },
                        'unit_amount': int(item['price']),  # SOLO entero, sin * 100 para CLP
                    },
                    'quantity': item['cantidad'],
                })
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                customer_email=email,
                success_url='http://localhost:8000/pago_exitoso',
                cancel_url='http://localhost:8000/carrito',
            )
            return Response({'url': session.url})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

def test_url(request):
    return JsonResponse({'ok': True})
