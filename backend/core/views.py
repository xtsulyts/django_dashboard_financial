from typing import Any
#from django.db.models.query import _BaseQuerySet
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
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
from .forms import register_user_form
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .forms import register_user_form

@csrf_exempt
def index(request):
    """
    Handle user registration requests from a React frontend.
    Expects JSON data in the request body with 'username', 'email', and 'password1', 'password2'.
    """
    if request.method == 'POST':
        # Parse the JSON data from the request body
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Create the form with the parsed data
        form = register_user_form(data)
        
        if form.is_valid():
            # Save the new user
            user = form.save()
            login_user(request, user)  # Log the user in automatically
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        else:
            # Return form errors in JSON format
            return JsonResponse({'errors': form.errors}, status=400)
    
    # Handle non-POST requests
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        # Validación simple (luego se puede integrar con el sistema de usuarios)
        if email == "test@example.com" and password == "12345":
            return JsonResponse({"message": "Login exitoso", "token": "fake-jwt-token"})
        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    return JsonResponse({"error": "Método no permitido"}, status=405)


def logout(request):
    try:
        del request.session["member_id"]
    except KeyError:
        pass
    return HttpResponse("You're logged out.")

# ##FORMULARIO DE CONTACTO##

# def contacto(request, ):
#   formulario = None
#   if request.method == 'POST':
      
#       formulario = ContactoForm ( request.POST )
#       if formulario.is_valid ():
#         messages.success(request, 'Recibimos tu mensaje')
             
#         contacto_db = Contacto (
#             nombre = formulario.cleaned_data ["nombre"],
#             apellido = formulario.cleaned_data ["apellido"],
#             email = formulario.cleaned_data ["email"],
#             mensaje = formulario.cleaned_data ["mensaje"]
#         )

#         contacto_db.save()
        
#         return redirect('index')

#       else:
#         messages.error(request, 'al cargar formulario')
       
#   else:
#       formulario = ContactoForm ()        
#   context =  {
#      'formulario_contacto'  : formulario 
#     }
#   return render(request, "contacto.html", context ) 


# ##VISTAS DEL SITIO## 

# def index(request):
#     contexto = {'mensaje': '¡Hola desde la vista de inicio!'}
#     return render(request, 'home.html', contexto)

# @login_required
# def modulo(request):
#     return render(request, 'modulo.html')
