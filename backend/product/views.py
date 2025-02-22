from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response


from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class ProductListCreateView(generics.ListCreateAPIView):
    """
    For the customer's dashboard (authenticated users).
    Provides:
      - GET /products/  -> List current user's products
      - POST /products/ -> Create a new product
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user, deleted=False)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ✅ Retrieve, Update & Soft-Delete (Requires PK)
class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or soft-delete a product.
    Provides:
      - GET /products/<uuid:pk>/ -> Retrieve product if owned by user
      - PUT/PATCH /products/<uuid:pk>/ -> Update product
      - DELETE /products/<uuid:pk>/ -> Soft-delete product
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"  # Explicitly specify that 'pk' is used

    def get_queryset(self):
        return Product.objects.filter(owner=self.request.user, deleted=False)

    def perform_destroy(self, instance):
        instance.deleted = True
        instance.save()


class ShopProductsView(generics.ListAPIView):
    """
    For the public shop listing (no auth required).
    Provides:
      - GET /shop-products/ -> List all products where:
           deleted=False, is_active=True, is_sold=False
         Strips out 'is_sold' from each product's output.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(deleted=False, is_active=True, is_sold=False)

    def list(self, request, *args, **kwargs):
        # Use the default list behavior
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Exclude `is_sold` from each product
        for product in data:
            product.pop('is_sold', None)

        return Response(data)


class ShopProductDetailView(generics.RetrieveAPIView):
    """
    For retrieving a single product for the shop.
    Provides:
      - GET /shop-products/<uuid:pk>/
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(deleted=False, is_active=True, is_sold=False)

    def retrieve(self, request, *args, **kwargs):
        # Use default retrieve and then strip out is_sold
        response = super().retrieve(request, *args, **kwargs)
        data = response.data
        data.pop('is_sold', None)
        return Response(data)


class AdminListCreateProductView(generics.ListCreateAPIView):
    """
    For admins with full CRUD access (including hard deletes).
    Provides:
      - GET /admin/product/              -> List all products (no filter)
      - POST /admin/product/             -> Create
    """
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class AdminDetailedProductView(generics.RetrieveUpdateDestroyAPIView):
    """
    For admins with full CRUD access (including hard deletes).
    Provides:
      - GET /admin/product/<uuid:pk>/    -> Retrieve
      - PUT/PATCH /admin/product/<uuid:pk>/ -> Update
      - DELETE /admin/product/<uuid:pk>/ -> Hard delete
    """
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
