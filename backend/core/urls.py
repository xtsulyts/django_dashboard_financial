from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import login_user, index, user_profile, CategoriaViewSet, TransaccionViewSet, totales_usuario, TransaccionListView, importar_transacciones, mp_sync, mp_status, mp_oauth_init, mp_oauth_callback, mp_disconnect
from rest_framework.documentation import include_docs_urls


router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'transacciones', TransaccionViewSet, basename='transaccion')


urlpatterns = [
    path("", index, name="index"),
    path("login_user/", login_user, name="login_user"),
    path("user_profile/", user_profile, name="user_profile"),
    path('api/', include(router.urls)),
    path("totales_usuario/", totales_usuario, name="totales_usuario"),
    path('movimientos/', TransaccionListView.as_view(), name="movimientos"),
    path('importar-transacciones/', importar_transacciones, name="importar_transacciones"),
    path('mp/sync/', mp_sync, name="mp_sync"),
    path('mp/status/', mp_status, name="mp_status"),
    path('mp/oauth/init/', mp_oauth_init, name="mp_oauth_init"),
    path('mp/callback/', mp_oauth_callback, name="mp_oauth_callback"),
    path('mp/disconnect/', mp_disconnect, name="mp_disconnect"),
    path("docs/", include_docs_urls(title="Dashboard Financial API")),
]