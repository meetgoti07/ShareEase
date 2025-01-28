# urls.py
from django.urls import path
from .views import CategoryListCreate, CategoryDetail, ProductListCreate, ProductDetail

urlpatterns = [
    path('categories/', CategoryListCreate.as_view()),
    path('categories/<int:pk>/', CategoryDetail.as_view()),
    path('products/', ProductListCreate.as_view()),
    path('products/<int:pk>/', ProductDetail.as_view()),
]