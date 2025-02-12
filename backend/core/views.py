
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
    Handle user registration requests from a React frontend.
    Expects JSON data in the request body with 'username', 'email', and 'password1', 'password2'.
    """
    if request.method == 'POST':
    
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Create the form with the parsed data
        form = register_user_form(data)
        
        if form.is_valid():
            # Save the new user
            user = form.save()
            login(request, user) 
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        else:
            
            return JsonResponse({'errors': form.errors}, status=400)
    
   
    return JsonResponse({'': 'url de inicio./8000'}, status=405)

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
                return JsonResponse({"message": "Login exitoso", "token": "fake-jwt-token"})

        return JsonResponse({"error": "Credenciales inválidas"}, status=401)

    return JsonResponse({"error": "Método no permitido"}, status=405)