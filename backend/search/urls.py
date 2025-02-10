from django.urls import path
from .views import SearchProducts

urlpatterns = [
    path("search/", SearchProducts.as_view(), name="search_products"),
]
