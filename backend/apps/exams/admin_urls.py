from rest_framework import routers
from .views import AdminExamViewSet

router = routers.DefaultRouter()
router.register(r'admin/exams', AdminExamViewSet, basename='admin-exams')

urlpatterns = router.urls
