from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'institute', 
            'department', 
            'division', 
            'mobile_number', 
            'company_name', 
            'address'
        ]
