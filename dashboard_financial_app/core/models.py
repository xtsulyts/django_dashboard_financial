from django.db import models
from django.contrib.auth.models import User

### FORMULARIO DE LOGIN ###
class Login (models.Model):
    nombre = models.CharField(max_length=30, verbose_name="Nombre")
    apellido = models.CharField(max_length=30, verbose_name="Apellido")
    email = models.EmailField(max_length=50, verbose_name= "Email")


### FORMULARIO DE CONTACTO ###

class Contacto (models.Model):
    nombre = models.CharField(max_length=30, verbose_name="Nombre")
    apellido = models.CharField(max_length=30, verbose_name="Apellido")
    email = models.CharField(max_length=50, verbose_name= "Email")
    mensaje = models.CharField(max_length=500, verbose_name="Mensaje")
