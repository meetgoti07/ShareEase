from django.db import models
from django.contrib.auth.models import User


class Property(models.Model):
    title = models.CharField(max_length=255)  # E.g., "2 BHK near College"
    description = models.TextField()  # Detailed description of the house
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='houses')
    location = models.TextField()
    images = models.TextField(blank=True, null=True)  # Store image URLs as a comma-separated string
    rent_per_month = models.DecimalField(max_digits=10, decimal_places=2)  # Rent per month
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)  # Security deposit amount
    furnished = models.BooleanField(default=False)  # Whether the house is furnished
    total_vacancy = models.PositiveIntegerField()  # Total number of rooms
    available_vacancy = models.PositiveIntegerField()
    sharing = models.PositiveIntegerField()
    is_available = models.BooleanField(default=True)  # Availability status
    custom_features = models.JSONField(blank=True, null=True)  # Store custom fields as a JSON string
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)