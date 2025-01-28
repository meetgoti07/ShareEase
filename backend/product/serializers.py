from rest_framework import serializers
from .models import Category, Product
from django.contrib.auth.models import User
import json

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class ExtraFeatureSerializer(serializers.Serializer):
    key = serializers.CharField()
    value = serializers.CharField()

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    images = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        write_only=True
    )
    extra_features = serializers.ListField(
        child=ExtraFeatureSerializer(),
        required=False,
        allow_empty=True,
        write_only=True
    )

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Convert comma-separated images string to array
        if instance.images:
            representation['images'] = instance.images.split(',')
        else:
            representation['images'] = []
        
        # Deserialize extra_features JSON string to a list of objects
        if instance.extra_features:
            try:
                representation['extra_features'] = json.loads(instance.extra_features)
            except json.JSONDecodeError:
                representation['extra_features'] = []
        else:
            representation['extra_features'] = []
        
        return representation

    def create(self, validated_data):
        images = validated_data.pop('images', None)
        if images:
            validated_data['images'] = ','.join(images)
        
        # Serialize extra_features list of objects to JSON string
        extra_features = validated_data.pop('extra_features', None)
        if extra_features is not None:
            validated_data['extra_features'] = json.dumps(extra_features)

        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        images = validated_data.pop('images', None)
        if images:
            validated_data['images'] = ','.join(images)
        
        # Serialize extra_features list of objects to JSON string
        extra_features = validated_data.pop('extra_features', None)
        if extra_features is not None:
            validated_data['extra_features'] = json.dumps(extra_features)

        return super().update(instance, validated_data)