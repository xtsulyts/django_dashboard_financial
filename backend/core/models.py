from django.db import models
from django.contrib.auth.models import User

### FORMULARIO DE LOGIN ###
class Register_User (models.Model):
    username = models.CharField(max_length=30, verbose_name="Nombre")
    email = models.EmailField(max_length=30, verbose_name="Email")
    password1 = models.EmailField(max_length=50, verbose_name= "Password")


