from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from .views import ApiOverview

urlpatterns = [
    path('', ApiOverview.as_view(), name='api-overview'),
    path('admin/', admin.site.urls),
    path('api/', include('ecomapp.urls')),
    path('user/', include("account.urls")),
    
]

urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)