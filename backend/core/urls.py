
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/', include('apps.users.admin_urls')),
    path('api/', include('apps.exams.admin_urls')),
]
