# urls.py
from django.urls import path
from .views import (
    PropertyListCreate,
    PropertyDetail,
    MyProperties,
    TogglePropertyAvailability,
)

urlpatterns = [
    path('properties/', PropertyListCreate.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', PropertyDetail.as_view(), name='property-detail'),
    path('my-properties/', MyProperties.as_view(), name='my-properties'),
    path('properties/<int:pk>/toggle-availability/',
         TogglePropertyAvailability.as_view(),
         name='toggle-property-availability'),
]