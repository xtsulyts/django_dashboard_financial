
#from django.db.models.query import _BaseQuerySet
from django.http import HttpResponse, HttpResponseRedirect
#from  core.forms import ContactoForm
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.csrf import csrf_protect
import sys
from django.utils import timezone
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
import os
from django.http import JsonResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import custom_user
from .forms import register_user_form
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse

from django.utils.decorators import method_decorator
import json
from .forms import register_user_form

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
    """
    Maneja las solicitudes de inicio de sesión desde un frontend en React.

    Esta función procesa solicitudes POST para autenticar a un usuario existente. 
    Espera recibir datos en formato JSON con los siguientes campos:

    - 'email': Dirección de correo electrónico del usuario.
    - 'password': Contraseña del usuario.

    Pasos:
    1. Extraer y analizar los datos JSON del cuerpo de la solicitud.
    2. Buscar un usuario en la base de datos con el correo electrónico proporcionado.
    3. Si el usuario existe, intentar autenticarlo con la contraseña ingresada.
    4. Si la autenticación es exitosa, devolver un mensaje de éxito junto con un token (simulado).
    5. Si las credenciales son incorrectas, devolver un error 401.
    6. Si el método de la solicitud no es POST, devolver un error 405.

    Retorna:
        JsonResponse: Una respuesta JSON indicando éxito con un token o detalles de error.
    """
    if request.method == "POST":
        """ 
        Extraer los datos JSON de la solicitud.

        Se espera que el frontend envíe un objeto JSON con las claves 'email' y 'password'. 
        """
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        """ 
        Buscar al usuario en la base de datos usando el correo electrónico.

        `custom_user.objects.filter(email=email).first()`:
        - Busca en la base de datos un usuario con el email proporcionado.
        - `.first()` se usa para evitar errores en caso de que haya múltiples resultados.
        - Si no encuentra un usuario, `user` será `None`.
        """
        user = custom_user.objects.filter(email=email).first()
        if user:
            """ 
            Intentar autenticar al usuario con la contraseña proporcionada.

            `authenticate(username=user.username, password=password)`:
            - Django usa el nombre de usuario (`username`) y la contraseña para la autenticación.
            - Si la contraseña es correcta, devuelve el objeto del usuario autenticado.
            - Si es incorrecta, devuelve `None`.
            """
            authenticated_user = authenticate(username=user.username, password=password)
            if authenticated_user is not None:
                """ 
                Si la autenticación es exitosa, devolver un mensaje de éxito con un token (simulado).
                
                *Nota:* Actualmente, este código usa un token ficticio ("fake-jwt-token").
                En un entorno real, se debería generar un token JWT válido para la autenticación.
                """
                return JsonResponse({"message": "Login exitoso", "token": "fake-jwt-token"})

        """ 
        Si el usuario no existe o la contraseña es incorrecta, devolver un error 401 (No autorizado).
        """
        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    """ 
    Si el método de la solicitud no es POST, devolver una respuesta 405 (Método no permitido).

    Esto evita que otros métodos HTTP interactúen con el endpoint de inicio de sesión.
    """
    return JsonResponse({"error": "Método no permitido"}, status=405)
