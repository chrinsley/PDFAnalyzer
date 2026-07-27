from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    UserViewset,
    uploadpdf,
    uploadpdfList,
)

router = DefaultRouter()
router.register(r'users', UserViewset,  basename='users')

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("uploadpdf/", uploadpdf, name="uploadpdf"),
    path("uploadpdfList/", uploadpdfList, name="uploadpdfList"),
]

urlpatterns += router.urls