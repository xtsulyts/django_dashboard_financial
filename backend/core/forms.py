from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import custom_user


# class register_user_form(UserCreationForm):
#     """
#     Formulario de registro de usuario basado en el modelo `custom_user`.

#     Este formulario extiende `UserCreationForm` de Django para permitir el registro de nuevos usuarios,
#     utilizando el modelo personalizado `custom_user`.

#     Meta:
#     -----
#     - `model`: Se utiliza el modelo `custom_user` en lugar del modelo de usuario predeterminado de Django.
#     - `fields`: Campos incluidos en el formulario de registro:
#         - `username`: Nombre de usuario único.
#         - `email`: Dirección de correo electrónico del usuario.
#         - `password1`: Contraseña del usuario.
#         - `password2`: Confirmación de la contraseña para validación.

#     Uso:
#     ----
#     Este formulario puede ser utilizado en vistas basadas en clases (`CreateView`) o en vistas basadas en funciones
#     para manejar el registro de usuarios.
#     """

#     class Meta:
#         model = custom_user
#         """ 
#         Define el modelo de usuario que se utilizará en el formulario. 
        
#         En este caso, se usa `custom_user`, un modelo personalizado basado en `AbstractUser`.
#         """

#         fields = ('username', 'email', 'password1', 'password2')
#         """ 
#         Especifica los campos que se incluirán en el formulario de registro.

#         - `username`: Nombre único del usuario.
#         - `email`: Dirección de correo electrónico del usuario.
#         - `password1`: Contraseña de acceso.
#         - `password2`: Confirmación de la contraseña (Django valida que coincidan).
#         """
