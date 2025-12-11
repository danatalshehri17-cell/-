from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'subscription_tier',
            'is_active', 'is_verified', 'date_joined', 'last_login', 'phone_number'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
