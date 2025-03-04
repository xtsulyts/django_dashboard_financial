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
    """
    Modelo para representar una categoría en el sistema.

    Este modelo define las categorías que pueden ser utilizadas para organizar 
    transacciones financieras u otros elementos del sistema.

    Atributos:
    - nombre (CharField): Nombre único de la categoría, con un límite de 100 caracteres.
    - descripcion (TextField): Descripción opcional de la categoría.

    Métodos:
    - __str__(): Devuelve el nombre de la categoría como representación en cadena.

    Meta:
    - verbose_name: Define un nombre amigable para la categoría en el panel de administración.
    - verbose_name_plural: Define el nombre en plural para la categoría en el panel de administración.
    """
    # Campo para el nombre de la categoría (único y con un máximo de 100 caracteres)
    nombre = models.CharField(max_length=100, unique=True, verbose_name="Nombre de la categoría")
    # Campo opcional para la descripción de la categoría
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción (opcional)")

    def __str__(self):
        """ Representación en cadena del objeto, devuelve el nombre de la categoría. """
        return self.nombre

    class Meta:
        # Nombre singular y plural para el modelo en la interfaz de administración de Django
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

class Transaccion(models.Model):
    """
    Modelo para representar una transacción financiera de un usuario.

    Este modelo almacena los ingresos y gastos de los usuarios, permitiendo categorizarlos
    y registrar detalles como monto, fecha y descripción.

    Atributos:
    - usuario (ForeignKey): Relación con el usuario que realizó la transacción.
    - monto (DecimalField): Monto de la transacción con hasta 10 dígitos y 2 decimales.
    - fecha (DateField): Fecha en que se realizó la transacción.
    - categoria (ForeignKey): Relación con una categoría (opcional).
    - descripcion (TextField): Descripción opcional de la transacción.
    - tipo (CharField): Tipo de transacción, puede ser "INGRESO" o "GASTO".

    Métodos:
    - __str__(): Devuelve una representación en cadena de la transacción.

    Meta:
    - verbose_name: Nombre amigable para la transacción en la administración de Django.
    - verbose_name_plural: Nombre en plural para la transacción en la administración de Django.
    """
    # Opciones para el tipo de transacción
    TIPO_CHOICES = [
        ('INGRESO', 'Ingreso'),
        ('GASTO', 'Gasto'),
    ]

    # Relación con el usuario que realizó la transacción

    # Usa el modelo de usuario de Django. Si el usuario se elimina, sus transacciones también, nombre relacionado para acceder a las transacciones del usuario
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transacciones")
    monto = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto")
    fecha = models.DateField(verbose_name="Fecha de la transacción")

    """
    Relación con el modelo Categoria, si la categoría se borra, la transacción sigue existiendo.
    Permite valores nulos en la base de datos, permite que el campo quede vacío en formularios
    """
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Categoría")
    descripcion = models.TextField(blank=True, null=True, verbose_name="Descripción")
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, verbose_name="Tipo de transacción")

    def __str__(self):
        return f"{self.tipo} - {self.monto} ({self.fecha})"

    class Meta:
        verbose_name = "Transacción"
        verbose_name_plural = "Transacciones"