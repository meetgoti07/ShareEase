from django.urls import path
from .views import (
    ProductRetrieveUpdateDestroyView,
    ProductListCreateView,
    ShopProductsView,
    ShopProductDetailView,
    AdminListCreateProductView,
    AdminDetailedProductView
)

from .views import CategoryDetailView, CategoryListView, CategoryListCreateView

urlpatterns = [
    # Customer dashboard endpoints
    path('my-products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('my-products/<uuid:pk>/', ProductRetrieveUpdateDestroyView.as_view(), name='product-detail'),

    path('categories/', CategoryListView.as_view(), name='product-list-create'),

    # Shop endpoints
    path('products/', ShopProductsView.as_view(), name='shop-products'),
    path('products/<uuid:pk>/', ShopProductDetailView.as_view(), name='shop-product-detail'),

    # Admin endpoints
    path('admin/products/', AdminListCreateProductView.as_view(), name='admin-product-list-create'),
    path('admin/products/<uuid:pk>/', AdminDetailedProductView.as_view(), name='admin-product-detail'),

    path('admin/categories/', CategoryListCreateView.as_view(), name='product-list-create'),
    path('admin/categories/<uuid:pk>/', CategoryDetailView.as_view(), name='product-detail'),
]
