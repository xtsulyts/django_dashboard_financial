from django.urls import path
from  core import views
from .views import  acercade, contacto, modulo, acercade, index, nosotros,login, paciente, TurnosListViews
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LogoutView
#from  Farmacia import views
from .views import  contacto, index
#import sys
#import os
urlpatterns = [
    path("", index, name="index"),

    path('accounts/login/', auth_views.LoginView.as_view (template_name='login.html'),name='login'),
    path('accounts/logout/', LogoutView.as_view(),name='logout'),
    path("contacto/", contacto, name="contacto"),
   
    ]
