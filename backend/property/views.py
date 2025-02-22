from rest_framework import generics, permissions
from .models import Property
from .serializers import PropertySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status

class DashboardPropertyListCreateView(generics.ListCreateAPIView):
    """
    GET /dashboard-properties/
       -> List properties owned by the current user.
    POST /dashboard-properties/
       -> Create a new property (sets owner=request.user).
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class DashboardPropertyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /dashboard-properties/<uuid:pk>/
       -> Retrieve a property (only if owned by the user).
    PUT/PATCH /dashboard-properties/<uuid:pk>/
       -> Update property details.
    DELETE /dashboard-properties/<uuid:pk>/
       -> Delete the property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Property.objects.filter(owner=self.request.user)



class ShopPropertiesView(generics.ListAPIView):
    """
    GET /shop-properties/
       -> List active properties with optional filters.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        filters = {'is_active': True}
        # Apply filters from query parameters if present:
        if self.request.query_params.get('owner'):
            filters['owner_id'] = self.request.query_params.get('owner')
        if self.request.query_params.get('furnished'):
            filters['furnished'] = self.request.query_params.get('furnished').lower() == 'true'
        if self.request.query_params.get('min_rent'):
            filters['rent_per_month__gte'] = float(self.request.query_params.get('min_rent'))
        if self.request.query_params.get('max_rent'):
            filters['rent_per_month__lte'] = float(self.request.query_params.get('max_rent'))
        if self.request.query_params.get('sharing'):
            filters['sharing'] = int(self.request.query_params.get('sharing'))
        return Property.objects.filter(**filters)


class ShopPropertyDetailView(generics.RetrieveAPIView):
    """
    GET /shop-properties/<uuid:pk>/
       -> Retrieve details of a single active property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        return Property.objects.filter(is_active=True)


class TogglePropertyAvailabilityView(APIView):
    """
    POST /dashboard-properties/<uuid:pk>/toggle-availability/
       -> Toggle the `is_active` status of a property.
         (Only accessible by the owner.)
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        property_obj = get_object_or_404(Property, pk=pk, owner=request.user)
        property_obj.is_active = not property_obj.is_active
        property_obj.save()
        serializer = PropertySerializer(property_obj, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminListCreatePropertyView(generics.ListCreateAPIView):
    """
    Admin view for properties with full CRUD access.

    GET /admin/properties/
       -> List all properties (including deleted ones, if needed).
    POST /admin/properties/
       -> Create a property.
    """
    serializer_class = PropertySerializer
    queryset = Property.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class AdminDetailedPropertyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin view for properties with full CRUD access.
    GET /admin/properties/<uuid:pk>/
       -> Retrieve a property.
    PUT/PATCH /admin/properties/<uuid:pk>/
       -> Update a property.
    DELETE /admin/properties/<uuid:pk>/
       -> Hard delete the property (permanently remove from the database).
    """
    serializer_class = PropertySerializer
    queryset = Property.objects.all()
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'pk'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        # Hard delete: permanently remove the property from the database.
        instance.delete()