# # In user/views.py
# from django.views import View
# from django.http import JsonResponse
# from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from allauth.socialaccount.providers.oauth2.views import OAuth2CallbackView
# from rest_framework_simplejwt.tokens import RefreshToken
#
#
# # Option 1: Using Django's View class
# class CustomGoogleOAuth2CallbackView(View):
#     def get(self, request, *args, **kwargs):
#         # Handle the OAuth2 callback
#
#         adapter = GoogleOAuth2Adapter(request)
#         callback_view = OAuth2CallbackView.adapter_view(adapter)
#
#         response = callback_view(request, *args, **kwargs)
#
#         # If the user is authenticated, generate JWT tokens
#         if request.user.is_authenticated:
#             refresh = RefreshToken.for_user(request.user)
#             return JsonResponse({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'user': {
#                     'id': request.user.id,
#                     'email': request.user.email,
#                     'username': request.user.username,
#                 }
#             })
#
#         # If authentication failed, return error
#         return JsonResponse({'error': 'Authentication failed'}, status=401)