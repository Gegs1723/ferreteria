from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pagos/', include('pagos_app.urls')),  # <--- usa 'pagos/' como prefijo
]