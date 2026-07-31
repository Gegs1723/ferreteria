from django.urls import path
from .views import CrearCheckoutStripe, test_url

urlpatterns = [
    path('checkout/', CrearCheckoutStripe.as_view(), name='crear_checkout_stripe'),
    path('test/', test_url),
]