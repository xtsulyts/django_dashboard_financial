from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models


class custom_user(AbstractUser):
    """
    Modelo personalizado de usuario basado en Django AbstractUser.

    Este modelo extiende la clase `AbstractUser` de Django para permitir personalizar 
    el modelo de usuario sin perder las funcionalidades predeterminadas como autenticación 
    y gestión de permisos.

    Atributos:
    -----------
    - `user`: Campo opcional para almacenar un nombre personalizado (diferente de `username`).
    - `email`: Dirección de correo electrónico del usuario (puede estar en blanco o ser nula).
    - `groups`: Relación ManyToMany con `auth.Group`, permite asignar grupos al usuario.
    - `user_permissions`: Relación ManyToMany con `auth.Permission`, maneja permisos específicos.

    Métodos:
    --------
    - `__str__()`: Retorna el nombre de usuario (`username`) como representación en texto del objeto.
    """

    user = models.CharField(max_length=100, blank=True, null=True)
    """ 
    Nombre personalizado del usuario (opcional).
    
    - `max_length=100`: Longitud máxima de 100 caracteres.
    - `blank=True`: Permite que el campo quede vacío en formularios.
    - `null=True`: Permite que el campo sea nulo en la base de datos.
    """

    email = models.EmailField(blank=True, null=True)
    """ 
    Dirección de correo electrónico del usuario (opcional).
    
    - `EmailField`: Valida automáticamente direcciones de correo electrónico.
    - `blank=True`: Puede estar vacío en formularios.
    - `null=True`: Puede ser nulo en la base de datos.
    """

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set', 
        blank=True,
    )
    """ 
    Relación ManyToMany con `auth.Group` para asignar grupos al usuario.

    - `related_name='customuser_set'`: Define el nombre de la relación inversa.
    - `blank=True`: Permite que el usuario no pertenezca a ningún grupo.
    """

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set', 
        blank=True,
    )
    """ 
    Relación ManyToMany con `auth.Permission` para gestionar permisos específicos del usuario.

    - `related_name='customuser_set'`: Define el nombre de la relación inversa.
    - `blank=True`: Permite que el usuario no tenga permisos asignados.
    """

    def __str__(self):
        """ 
        Retorna una representación en texto del usuario.

        En este caso, devuelve el `username`, lo que facilita la identificación 
        del usuario en el panel de administración o en consultas de base de datos.
        """
        return self.username
