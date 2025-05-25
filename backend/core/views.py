
from django.contrib.auth.decorators import login_required, permission_required
from django.utils import timezone
from django.http import JsonResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import custom_user
from .forms import register_user_form
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from .forms import register_user_form
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, generics
from .models import Categoria, Transaccion, models, custom_user
from .serializer_ import CategoriaSerializer, TransaccionSerializer, TransaccionListSerializer
from rest_framework.views import APIView
from django.shortcuts import redirect
#from allauth.socialaccount.views import SignupView
from django.contrib.auth.backends import ModelBackend
import requests
from django.contrib.auth.models import User

@csrf_exempt
def index(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)

        form = register_user_form(data)
        
        if form.is_valid():
            user = form.save()
            
            # ¡Agrega esta línea crítica!
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            
            login(request, user)  # Ahora funciona
            return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)
        else:
            return JsonResponse({'errors': form.errors}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

# views.py (login_user)
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user = custom_user.objects.filter(email=email).first()
        if user:
            authenticated_user = authenticate(username=user.username, password=password)
            if authenticated_user is not None:
                # Generar los tokens JWT
                refresh = RefreshToken.for_user(authenticated_user)
                access_token = str(refresh.access_token)
                
                return JsonResponse({
                    "message": f"Login exitoso desde URL/login_user back django:8000 usuario: {user.username}",
                    "access_token": access_token,
                    "refresh_token": str(refresh)  # El refresh token también se envía
                })

        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    return JsonResponse({"error": "Método no permitido"}, status=405)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Endpoint para obtener el perfil del usuario autenticado.

    Este endpoint permite a los usuarios autenticados obtener información sobre su perfil, 
    incluyendo su nombre de usuario y su ID.

    Requisitos:
    - El usuario debe estar autenticado mediante un `access_token`.
    - La autenticación se maneja a través de `IsAuthenticated`, lo que significa que se requiere 
      un token válido para acceder a este recurso.

    Parámetros:
    - request (HttpRequest): La solicitud HTTP recibida.

    Retorno:
    - JsonResponse: Un diccionario con los datos del usuario autenticado:
        {
            "user": "nombre_de_usuario",
            "id": 123
        }
    """
    return JsonResponse({
        "user": request.user.username,
        "id": request.user.id,
        # "password:": request.user.password  # Comentado por seguridad
    })





class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las categorías.

    Este ViewSet permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar)
    sobre las categorías almacenadas en la base de datos.

    Atributos:
    - queryset: Obtiene todas las categorías registradas.
    - serializer_class: Usa `CategoriaSerializer` para serializar/deserializar los datos.

    Métodos heredados de `ModelViewSet`:
    - list(): Obtiene todas las categorías.
    - retrieve(): Obtiene una categoría específica.
    - create(): Crea una nueva categoría.
    - update(): Actualiza una categoría existente.
    - destroy(): Elimina una categoría.
    """
    # Obtiene todas las categorías de la base de datos
    queryset = Categoria.objects.all() 

    # Especifica el serializador que se usará para convertir los datos de la categoría
    serializer_class = CategoriaSerializer 

class TransaccionViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las transacciones de los usuarios autenticados.

    Este ViewSet permite a los usuarios autenticados realizar operaciones CRUD
    sobre sus transacciones personales. No permite acceder a transacciones de otros usuarios.

    Atributos:
    - serializer_class: Usa `TransaccionSerializer` para serializar/deserializar los datos.
    - permission_classes: Restringe el acceso solo a usuarios autenticados (`IsAuthenticated`).

    Métodos:
    - get_queryset(): Devuelve solo las transacciones del usuario autenticado.
    - perform_create(): Asigna automáticamente la transacción al usuario autenticado al crearla.
    """
    # Define el serializador que se usará para las transacciones
    serializer_class = TransaccionSerializer

    # Asegura que solo usuarios autenticados accedan
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        """
        Filtra las transacciones para que cada usuario solo vea las suyas.

        Retorna:
        - QuerySet con todas las transacciones pertenecientes al usuario autenticado.
        """
        # Filtra las transacciones para devolver solo las del usuario autenticado
        return Transaccion.objects.filter(usuario=self.request.user)


    def perform_create(self, serializer):
        """
        Asigna automáticamente la transacción al usuario autenticado al guardarla.

        - Si el usuario está autenticado, se asigna `self.request.user` como el propietario de la transacción.
        - Si el usuario no está autenticado, lanza un error.

        Parámetros:
        - serializer (TransaccionSerializer): Datos serializados de la transacción.

        Excepciones:
        - ValueError: Se lanza si el usuario no está autenticado.
        """
        # Asigna automáticamente la transacción al usuario autenticado al guardarla
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(usuario=self.request.user)
        else:
            raise ValueError("El usuario no está autenticado.")




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def totales_usuario(request):
    """
    Endpoint para obtener los totales de ingresos, gastos y el saldo total del usuario autenticado.

    Este endpoint filtra todas las transacciones del usuario autenticado, separa los ingresos y gastos, 
    calcula sus totales y devuelve el saldo final.

    Requisitos:
    - El usuario debe estar autenticado mediante un `access_token`.

    Parámetros:
    - request (HttpRequest): La solicitud HTTP recibida.

    Retorno:
    - JsonResponse: Un diccionario con los totales de ingresos, gastos y el saldo total:
        {
            "total_ingresos": 1000.00,
            "total_gastos": 500.00,
            "saldo_total": 500.00
        }
    """
    # Obtener el usuario logueado
    usuario = request.user

    # Filtrar transacciones del usuario
    transacciones = Transaccion.objects.filter(usuario=usuario)

    # Calcular totales
    total_ingresos = transacciones.filter(tipo='INGRESO').aggregate(total=models.Sum('monto'))['total'] or 0
    total_gastos = transacciones.filter(tipo='GASTO').aggregate(total=models.Sum('monto'))['total'] or 0
    saldo_total = total_ingresos - total_gastos

    # Devolver los totales en formato JSON
    return JsonResponse({
        'total_ingresos': total_ingresos,
        'total_gastos': total_gastos,
        'saldo_total': saldo_total,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def listado_transacciones(request):
    """
    Endpoint para obtener el listado de transacciones del usuario autenticado.

    Este endpoint filtra todas las transacciones del usuario autenticado, separa los ingresos y gastos, 
    calcula sus totales y devuelve el saldo final.

    Requisitos:
    - El usuario debe estar autenticado mediante un `access_token`.

    Parámetros:
    - request (HttpRequest): La solicitud HTTP recibida.

    Retorno:
    - JsonResponse: Un diccionario con los totales de ingresos, gastos y el saldo total:
        {
            "total_ingresos": ...,
           
        }
    """
    # Obtener el usuario logueado
    usuario = request.user

    # Filtrar transacciones del usuario
    transacciones = Transaccion.objects.filter(usuario=usuario)

    # obtener transacciones 
    transacciones_listado = transacciones.filter(categoria='categoria').aggregate(monto=models('monto'), tipo=models('tipo'), fecha=models('fecha'), descripcio=models('descriocion'))['transaccion']
    

    # Devolver los totales en formato JSON
    return JsonResponse({
        'listado_transaccines': transacciones_listado,
        
        
    })


class TransaccionListView(generics.ListAPIView):
    serializer_class = TransaccionListSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        """
        Filtra las transacciones solo del usuario autenticado.
        """
        return Transaccion.objects.filter(usuario=self.request.user).select_related("categoria", "usuario") 
    


# @csrf_exempt
# def google_auth(request):
#     if request.method == 'POST':
#         token = request.POST.get('token')
        
#         try:
#             google_response = requests.get(
#                 f'https://oauth2.googleapis.com/tokeninfo?id_token={token}'
#             )
#             user_data = google_response.json()
            
#             # Verifica que el token sea para TU aplicación
#             if user_data.get('aud') != 'TU_CLIENT_ID_GOOGLE':  # Reemplaza con tu ID real
#                 return JsonResponse({'status': 'error', 'message': 'Token inválido'}, status=400)
                
#             # Autentica o crea el usuario (ejemplo básico)
#             user, created = User.objects.get_or_create(
#                 email=user_data['email'],
#                 defaults={'username': user_data['email']}
#             )
            
#             return JsonResponse({
#                 'status': 'success',
#                 'user': {'email': user.email}
#             })
            
#         except Exception as e:
#             return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
#     return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)