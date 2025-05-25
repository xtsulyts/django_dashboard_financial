from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  login_user, index, user_profile, CategoriaViewSet, TransaccionViewSet, totales_usuario, TransaccionListView #google_auth
from rest_framework.documentation import include_docs_urls


router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'transacciones', TransaccionViewSet, basename='transaccion')


urlpatterns = [
    path("", index, name="index"),
    path("login_user/", login_user, name="login_user"), 
    path("user_profile/", user_profile, name="user_profile"),
    path('api/', include(router.urls)),
    path("totales_usuario/", totales_usuario, name="totales_usuario" ),
    path('movimientos/', TransaccionListView.as_view(), name="movimientos"),
    #path('accounts/google/login/callback/', CustomGoogleCallback.as_view(), name='google_callback'),
    path("docs/", include_docs_urls(title="Dashboard Financial API")),
    #path('auth/google/', google_auth, name='google-auth')
   
   ]