from django.urls import path
from .views import (
    DashboardPropertyListCreateView,
    DashboardPropertyRetrieveUpdateDestroyView,
    ShopPropertiesView,
    ShopPropertyDetailView,
    TogglePropertyAvailabilityView,
    AdminDetailedPropertyView,
    AdminListCreatePropertyView
)

urlpatterns = [
    # Dashboard endpoints (require authentication and ownership)
    path('my-properties/', DashboardPropertyListCreateView.as_view(), name='dashboard-property-list-create'),
    path('my-properties/<uuid:pk>/', DashboardPropertyRetrieveUpdateDestroyView.as_view(),
         name='dashboard-property-detail'),

    path('admin/properties/<uuid:pk>/toggle-availability/', TogglePropertyAvailabilityView.as_view(),
         name='toggle-property-availability'),

    # Public shop endpoints (read-only)
    path('properties/', ShopPropertiesView.as_view(), name='shop-properties'),
    path('properties/<uuid:pk>/', ShopPropertyDetailView.as_view(), name='shop-property-detail'),
    path('admin/properties/', AdminListCreatePropertyView.as_view(), name='admin-property-list-create'),
    path('admin/properties/<uuid:pk>/', AdminDetailedPropertyView.as_view(), name='admin-property-detail'),
]
