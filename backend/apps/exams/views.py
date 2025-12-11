from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdminRole
from .models import Exam
from .serializers import ExamSerializer # Assuming you have this

class AdminExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all().order_by('-created_at')
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]