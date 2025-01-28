from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer
from django.contrib.auth.models import User

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
