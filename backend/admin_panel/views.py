from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from product.models import Product, Category
from property.models import Property
from user.models import UserProfile
from .serializers import ProductSerializer, CategorySerializer, PropertySerializer, UserProfileSerializer
from .permissions import IsSuperUser

# ✅ Category Views (Admin Only)
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsSuperUser]


# ✅ Product Views (Admin Only)
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]


# ✅ Property Views (Admin Only)
class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated, IsSuperUser]


# ✅ User Profile Views (Admin Only)
class UserProfileListView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]



# views.py
from rest_framework import status
from allauth.account.utils import complete_signup
from dj_rest_auth.registration.views import LoginView
from rest_framework.permissions import AllowAny

class AdminLoginView(LoginView):
    permission_classes = [AllowAny]

    def login(self, *args, **kwargs):
        # First perform the regular login
        response = super().login(*args, **kwargs)

        # Check if the user is a superuser
        if self.user and self.user.is_superuser:
            return response
        else:
            # If not a superuser, logout and return error
            self.logout()
            return JsonResponse({
                'detail': 'Only admin users are allowed to access this endpoint.'
            }, status=status.HTTP_403_FORBIDDEN)

    def logout(self):
        if self.user:
            self.user.auth_token.delete()
