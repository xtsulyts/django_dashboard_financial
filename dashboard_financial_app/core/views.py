from typing import Any
#from django.db.models.query import _BaseQuerySet
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseRedirect
from  core.forms import ContactoForm
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.csrf import csrf_protect
import sys
from core.models import Contacto, Turno, Paciente
from django.utils import timezone
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
import os
from django_nextjs.render import render_nextjs_page_sync



##FORMULARIO DE CONTACTO##

def contacto(request, ):
  formulario = None
  if request.method == 'POST':
      
      formulario = ContactoForm ( request.POST )
      if formulario.is_valid ():
        messages.success(request, 'Recibimos tu mensaje')
             
        contacto_db = Contacto (
            nombre = formulario.cleaned_data ["nombre"],
            apellido = formulario.cleaned_data ["apellido"],
            email = formulario.cleaned_data ["email"],
            mensaje = formulario.cleaned_data ["mensaje"]
        )

        contacto_db.save()
        
        return redirect('index')

      else:
        messages.error(request, 'al cargar formulario')
       
  else:
      formulario = ContactoForm ()        
  context =  {
     'formulario_contacto'  : formulario 
    }
  return render(request, "contacto.html", context ) 


##VISTAS DEL SITIO## 

def index(request):
    contexto = {'mensaje': '¡Hola desde la vista de inicio!'}
    return render(request, 'home.html', contexto)

@login_required
def modulo(request):
    return render(request, 'modulo.html')
