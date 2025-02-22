from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import UserProfile
from .serializers import UserProfileSerializer
from dj_rest_auth.registration.views import LoginView
from rest_framework import generics, status

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile  # Access UserProfile via the related name
            serializer = UserProfileSerializer(profile)
            # Include first_name in the response
            response_data = serializer.data
            response_data['name'] = request.user.username
            return Response(response_data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = request.user.profile
            user = request.user  # Access the authenticated user

            # Extract first_name from the request data if provided
            username = request.data.get('name', None)

            # Update first_name if it's provided
            if username is not None:
                user.username = username
                user.save()

            # Update the profile data
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                response_data = serializer.data
                response_data['name'] = user.first_name  # Include updated first_name
                return Response(response_data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class UserProfileListView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

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
