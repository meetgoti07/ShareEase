from rest_framework import serializers
from .models import Property
import json

class ExtraFeatureSerializer(serializers.Serializer):
    key = serializers.CharField()
    value = serializers.CharField()

class PropertySerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.CharField(source='owner.email', read_only=True)
    images = serializers.ListField(child=serializers.URLField(), required=False)
    custom_features = serializers.ListField(child=ExtraFeatureSerializer(), required=False, allow_empty=True)

    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'description',
            'owner_name',
            'owner_email',
            'location',
            'images',  # This will handle both input (list) and output (list)
            'rent_per_month',
            'security_deposit',
            'furnished',
            'total_vacancy',
            'available_vacancy',
            'sharing',
            'is_available',
            'custom_features',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'owner_name', 'owner_email', 'created_at', 'updated_at']

    def to_representation(self, instance):
        """ Convert stored comma-separated image URLs to a list when retrieving data """
        data = super().to_representation(instance)
        data['images'] = instance.images.split(',') if instance.images else []
        return data

    def create(self, validated_data):
        """ Convert list of image URLs into a comma-separated string before saving """
        images = validated_data.pop('images', [])
        validated_data['images'] = ','.join(images) if images else ""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """ Convert list of image URLs into a comma-separated string before updating """
        images = validated_data.pop('images', None)
        if images is not None:
            instance.images = ','.join(images)
        return super().update(instance, validated_data)
