from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


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


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre de la categoría")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción (opcional)")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class Transaccion(models.Model):
    TIPO_CHOICES = [
        ('INGRESO', 'Ingreso'),
        ('GASTO', 'Gasto'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transacciones")
    monto = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto")
    fecha = models.DateField(verbose_name="Fecha de la transacción")
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Categoría")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, verbose_name="Tipo de transacción")

    def __str__(self):
        return f"{self.tipo} - {self.monto} ({self.fecha})"

    class Meta:
        verbose_name = "Transacción"
        verbose_name_plural = "Transacciones"