from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models

class User(AbstractUser, PermissionsMixin):
    """
    Custom User model supporting Roles and Subscription Tiers.
    Ref: [cite: 2, 6, 10]
    """
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CREATOR = "CREATOR", "Creator"
        STUDENT = "STUDENT", "Student"

    class Tiers(models.TextChoices):
        FREE = "FREE", "Free"
        PREMIUM = "PREMIUM", "Premium"

    # AbstractUser already includes: username, first_name, last_name, email
    email = models.EmailField(unique=True) # [cite: 3]
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True) # [cite: 4]
    
    role = models.CharField(
        max_length=20, 
        choices=Roles.choices, 
        default=Roles.STUDENT
    ) # [cite: 6]
    
    subscription_tier = models.CharField(
        max_length=20, 
        choices=Tiers.choices, 
        default=Tiers.FREE
    ) # [cite: 10]

    is_2fa_enabled = models.BooleanField(default=False) # [cite: 14]
    
    # Resolving conflict with built-in auth groups
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )
    verification_code = models.CharField(max_length=6, null=True, blank=True)
    is_verified = models.BooleanField(default=False)