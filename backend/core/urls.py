from django.urls import path
#from  core import views 
# from .views import  acercade, contacto, modulo, acercade, index, nosotros,login, paciente, TurnosListViews
# from django.contrib.auth import views as auth_views
# from django.contrib.auth.decorators import login_required
# from django.contrib.auth import views as auth_views
# from django.contrib.auth.views import LogoutView
# #from  Farmacia import views
from .views import  login, index

urlpatterns = [
    path("", index, name="index"),
    path("login/", login, name="login"),  
   ]
