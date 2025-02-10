from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    ProductListCreateView, ProductDetailView,
    PropertyListCreateView, PropertyDetailView,
    UserProfileListView, UserProfileDetailView,
    AdminLoginView
)

urlpatterns = [
    # ✅ Categories
    path('admin/categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('admin/categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),

    # ✅ Products
    path('admin/products/', ProductListCreateView.as_view(), name='product-list'),
    path('admin/products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # ✅ Properties
    path('admin/properties/', PropertyListCreateView.as_view(), name='property-list'),
    path('admin/properties/<int:pk>/', PropertyDetailView.as_view(), name='property-detail'),

    # ✅ User Profiles
    path('admin/user-profiles/', UserProfileListView.as_view(), name='userprofile-list'),
    path('admin/user-profiles/<int:pk>/', UserProfileDetailView.as_view(), name='userprofile-detail'),

    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
]
