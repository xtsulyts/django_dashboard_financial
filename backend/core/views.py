
from django.contrib.auth.decorators import login_required, permission_required
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from .models import custom_user
from .forms import register_user_form
from django.contrib.auth import login, authenticate
from .forms import register_user_form
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets, generics
from .models import Categoria, Transaccion, models, custom_user
from .serializer_ import CategoriaSerializer, TransaccionSerializer, TransaccionListSerializer
from rest_framework.views import APIView
from django.shortcuts import redirect
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def importar_transacciones(request):
    transacciones_data = request.data.get('transacciones', [])
    creadas = 0
    errores = []

    for item in transacciones_data:
        serializer = TransaccionSerializer(data={
            'monto': item.get('monto'),
            'fecha': item.get('fecha'),
            'tipo': item.get('tipo'),
            'descripcion': item.get('descripcion', ''),
            'categoria': item.get('categoriaId'),
            'usuario': request.user.id,
        })
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            creadas += 1
        else:
            errores.append({'fila': item, 'errores': serializer.errors})

    return JsonResponse({'creadas': creadas, 'errores': errores}, status=201)


class TransaccionListView(generics.ListAPIView):
    serializer_class = TransaccionListSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get_queryset(self):
        """
        Filtra las transacciones solo del usuario autenticado.
        """
        return Transaccion.objects.filter(usuario=self.request.user).select_related("categoria", "usuario") 
    


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mp_status(request):
    conectado = bool(request.user.mp_access_token) or bool(os.getenv('MP_ACCESS_TOKEN'))
    return JsonResponse({'conectado': conectado})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mp_oauth_init(request):
    client_id = os.getenv('MP_CLIENT_ID')
    redirect_uri = os.getenv('MP_REDIRECT_URI', 'http://localhost:8000/mp/callback/')
    state = str(request.auth)  # JWT token — identifica al usuario en el callback

    auth_url = (
        f"https://auth.mercadopago.com.ar/authorization"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&platform_id=mp"
        f"&state={state}"
    )
    return JsonResponse({'auth_url': auth_url})


def mp_oauth_callback(request):
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    code = request.GET.get('code')
    state = request.GET.get('state')

    if not code:
        return redirect(f"{frontend_url}/?mp_error=no_code")

    # Identificar usuario desde el JWT en state
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import TokenError
    try:
        decoded = AccessToken(state)
        user = custom_user.objects.get(id=decoded['user_id'])
    except (TokenError, custom_user.DoesNotExist, Exception):
        return redirect(f"{frontend_url}/?mp_error=invalid_state")

    # Intercambiar code por access_token
    token_res = requests.post(
        'https://api.mercadopago.com/oauth/token',
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        data={
            'client_id': os.getenv('MP_CLIENT_ID'),
            'client_secret': os.getenv('MP_CLIENT_SECRET'),
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': os.getenv('MP_REDIRECT_URI', 'http://localhost:8000/mp/callback/'),
        },
        timeout=10,
    )

    if token_res.status_code != 200:
        return redirect(f"{frontend_url}/?mp_error=token_failed")

    data = token_res.json()
    user.mp_access_token = data.get('access_token')
    user.mp_refresh_token = data.get('refresh_token', '')
    user.save()

    return redirect(f"{frontend_url}/?mp_connected=true")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mp_disconnect(request):
    request.user.mp_access_token = None
    request.user.mp_refresh_token = None
    request.user.save()
    return JsonResponse({'desconectado': True})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mp_sync(request):
    access_token = request.user.mp_access_token or os.getenv('MP_ACCESS_TOKEN')
    if not access_token:
        return JsonResponse({'error': 'MercadoPago no conectado'}, status=400)

    fecha_desde = request.data.get('fecha_desde')
    fecha_hasta = request.data.get('fecha_hasta')

    if not fecha_desde or not fecha_hasta:
        return JsonResponse({'error': 'Parámetros fecha_desde y fecha_hasta requeridos'}, status=400)

    headers = {'Authorization': f'Bearer {access_token}'}
    params = {
        'begin_date': f'{fecha_desde}T00:00:00.000-03:00',
        'end_date': f'{fecha_hasta}T23:59:59.000-03:00',
        'range': 'date_created',
        'sort': 'date_created',
        'criteria': 'desc',
        'limit': 100,
    }

    try:
        response = requests.get(
            'https://api.mercadopago.com/v1/payments/search',
            headers=headers,
            params=params,
            timeout=10,
        )
    except requests.RequestException as e:
        return JsonResponse({'error': f'Error de red: {str(e)}'}, status=502)

    if response.status_code != 200:
        return JsonResponse(
            {'error': 'Error al consultar MercadoPago', 'detalle': response.text},
            status=400
        )

    data = response.json()
    mp_user_id = str(os.getenv('MP_USER_ID', ''))

    creadas = 0
    duplicadas = 0

    for pago in data.get('results', []):
        if pago.get('status') != 'approved':
            continue

        mp_id = str(pago['id'])

        if Transaccion.objects.filter(mp_payment_id=mp_id).exists():
            duplicadas += 1
            continue

        collector_id = str(pago.get('collector_id', ''))
        tipo = 'INGRESO' if (not mp_user_id or collector_id == mp_user_id) else 'GASTO'

        fecha_str = pago.get('date_approved') or pago.get('date_created', '')
        fecha = fecha_str[:10]

        descripcion = pago.get('description') or f'Pago MP #{mp_id}'

        Transaccion.objects.create(
            usuario=request.user,
            monto=pago['transaction_amount'],
            fecha=fecha,
            tipo=tipo,
            descripcion=descripcion,
            fuente='mercadopago',
            mp_payment_id=mp_id,
        )
        creadas += 1

    return JsonResponse({
        'creadas': creadas,
        'duplicadas': duplicadas,
        'total_mp': len(data.get('results', [])),
    })


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