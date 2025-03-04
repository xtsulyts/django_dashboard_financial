from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  login_user, index, user_profile, CategoriaViewSet, TransaccionViewSet, totales_usuario

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'transacciones', TransaccionViewSet, basename='transaccion')


urlpatterns = [
    path("", index, name="index"),
    path("login_user/", login_user, name="login_user"), 
    path("user_profile/", user_profile, name="user_profile"),
    path('api/', include(router.urls)),
    path("totales_usuario/", totales_usuario, name="totales_usuario" )
   
   ]