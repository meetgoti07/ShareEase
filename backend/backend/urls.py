from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    path("_allauth/api/", include("user.urls")),
    path("_allauth/api/", include("product.urls")),
    path("_allauth/api/", include("property.urls")),
    path("_allauth/api/", include("search.urls")),
]
