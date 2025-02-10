from rest_framework import serializers
from django.contrib.auth.models import User
from product.models import Product
from product.models import Category
from property.models import Property
from user.models import UserProfile

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show username instead of ID

    class Meta:
        model = UserProfile
        fields = '__all__'
