
from django.contrib.auth.decorators import login_required, permission_required
from django.utils import timezone
from django.http import JsonResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from .models import custom_user
from .forms import register_user_form
from django.contrib.auth import login, authenticate
from django.http import JsonResponse
from .forms import register_user_form
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import viewsets
from .models import Categoria, Transaccion
from .serializer_ import CategoriaSerializer, TransaccionSerializer

@csrf_exempt
def index(request):
    """
    Maneja las solicitudes de registro de usuario desde un frontend en React.

    Esta función procesa solicitudes POST para registrar un nuevo usuario. 
    Espera recibir datos en formato JSON con los siguientes campos:
    
    - 'username': Nombre de usuario deseado para la nueva cuenta.
    - 'email': Dirección de correo electrónico del usuario.
    - 'password1': Contraseña elegida.
    - 'password2': Confirmación de la contraseña.

    Pasos:
    1. Extraer y analizar los datos JSON del cuerpo de la solicitud.
    2. Validar los datos utilizando `register_user_form`.
    3. Si el formulario es válido, crear un nuevo usuario y autenticarlo automáticamente.
    4. Devolver un mensaje de éxito con estado 201.
    5. Si la validación falla, devolver los errores del formulario con estado 400.
    6. Si el método de la solicitud no es POST, devolver un error 405.

    Retorna:
        JsonResponse: Una respuesta JSON indicando éxito o detalles de error.
    """
    if request.method == 'POST':
    
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)

        """ 
        Crear una instancia del formulario con los datos JSON analizados.

        `register_user_form` es una clase de formulario de Django diseñada para 
        validar los datos de registro del usuario. Verifica:
        - Si el nombre de usuario es único.
        - Si el correo electrónico tiene un formato válido.
        - Si las contraseñas coinciden y cumplen con los requisitos de seguridad.
        
        Si los datos proporcionados no cumplen con los criterios de validación, 
        `form.is_valid()` devolverá False y los errores se enviarán de vuelta 
        al frontend.
        """
        form = register_user_form(data)
        
        if form.is_valid():
            """ 
            Si los datos del formulario son válidos, crear un nuevo usuario y autenticarlo.

            - `form.save()` crea y almacena el nuevo usuario en la base de datos.
            - `login(request, user)` inicia sesión automáticamente después del registro.
            
            La respuesta enviada confirma el registro exitoso.
            """
            user = form.save()
            login(request, user) 
            return JsonResponse({'message': 'Usuario registrado exitosamente'}, status=201)
        else:
            """ 
            Si el formulario no es válido, devolver los errores de validación.

            La respuesta incluirá mensajes de error detallados desde el formulario 
            para que el frontend pueda mostrar los avisos adecuados al usuario.
            """
            return JsonResponse({'errors': form.errors}, status=400)

    """ 
    Si el método de la solicitud no es POST, devolver una respuesta 405 (Método no permitido).

    Esto evita que otros métodos HTTP interactúen con el endpoint de registro.
    """
    return JsonResponse({'error': 'Método no permitido. URL de inicio: /8000'}, status=405)




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
                    "message": "Login exitoso desde login_user back:",
                    "access_token": access_token,
                    "refresh_token": str(refresh)  # El refresh token también se envía
                })

        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    return JsonResponse({"error": "Método no permitido"}, status=405)




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    return JsonResponse({"user": request.user.username,
                         #"email": request.user.email,
                         #"password:": request.user.password
                         })



class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class TransaccionViewSet(viewsets.ModelViewSet):
    serializer_class = TransaccionSerializer

    def get_queryset(self):
        # Solo devuelve las transacciones del usuario logueado
        return Transaccion.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asigna el usuario logueado a la transacción al crearla
        serializer.save(usuario=self.request.user)




