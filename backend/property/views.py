from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Property
from .serializers import PropertySerializer


class PropertyBaseView(APIView):
    """Base class for property-related views to avoid repetition."""

    def get_object(self, pk, user=None):
        """Retrieve property by ID, ensuring the user owns it if required."""
        property_obj = get_object_or_404(Property, pk=pk)

        if user and property_obj.owner != user:
            return Response(
                {"detail": "You do not have permission to access this property."},
                status=status.HTTP_403_FORBIDDEN
            )
        return property_obj


class PropertyListCreate(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        """List all available properties with filters."""
        filters = {'is_available': True}

        # Apply filters based on query params
        owner_id = request.query_params.get('owner')
        if owner_id:
            filters['owner_id'] = owner_id

        furnished = request.query_params.get('furnished')
        if furnished is not None:
            filters['furnished'] = furnished.lower() == 'true'

        min_rent = request.query_params.get('min_rent')
        max_rent = request.query_params.get('max_rent')
        if min_rent:
            filters['rent_per_month__gte'] = float(min_rent)
        if max_rent:
            filters['rent_per_month__lte'] = float(max_rent)

        sharing = request.query_params.get('sharing')
        if sharing:
            filters['sharing'] = int(sharing)

        # Retrieve filtered properties
        properties = Property.objects.filter(**filters)
        serializer = PropertySerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Create a new property listing."""
        serializer = PropertySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyDetail(PropertyBaseView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """Retrieve a property listing."""
        property_obj = self.get_object(pk)
        serializer = PropertySerializer(property_obj, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        """Update a property listing."""
        property_obj = self.get_object(pk, request.user)

        if isinstance(property_obj, Response):  # If permission check fails
            return property_obj

        serializer = PropertySerializer(property_obj, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete a property listing."""
        property_obj = self.get_object(pk, request.user)

        if isinstance(property_obj, Response):  # If permission check fails
            return property_obj

        property_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyProperties(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """List all properties owned by the current user."""
        filters = {'owner': request.user}

        is_available = request.query_params.get('is_available')
        if is_available is not None:
            filters['is_available'] = is_available.lower() == 'true'

        properties = Property.objects.filter(**filters)
        serializer = PropertySerializer(properties, many=True, context={'request': request})
        return Response(serializer.data)


class TogglePropertyAvailability(PropertyBaseView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Toggle the availability status of a property."""
        property_obj = self.get_object(pk, request.user)

        if isinstance(property_obj, Response):  # If permission check fails
            return property_obj

        property_obj.is_available = not property_obj.is_available
        property_obj.save()
        serializer = PropertySerializer(property_obj, context={'request': request})
        return Response(serializer.data)
