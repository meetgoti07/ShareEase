# urls.py
from django.urls import path
from .views import UserProfileView, AdminLoginView, UserProfileListView, UserProfileDetailView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='profile-detail'),
    path('admin/users/', UserProfileListView.as_view(), name='userprofile-list'),
    path('admin/users/<int:pk>/', UserProfileDetailView.as_view(), name='userprofile-detail'),

    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
]