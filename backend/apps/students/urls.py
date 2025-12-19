from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, ClassViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet)
router.register(r'classes', ClassViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
