from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models


class custom_user(AbstractUser):
    # Campos adicionales
    user = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    # Relacionar los grupos y permisos con un nombre diferente
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',  # Evita el conflicto de nombres
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',  # Evita el conflicto de nombres
        blank=True,
    )

    def __str__(self):
        return self.username

# class custom_user_0(AbstractUser):
#     # Campos adicionales
#     user = models.CharField(max_length=100, blank=True, null=True)
#     email = models.EmailField(blank=True, null=True)
    
#     # Relacionar los grupos y permisos con un nombre diferente
#     groups = models.ManyToManyField(
#         'auth.Group',
#         related_name='customuser_set',  
#         blank=True,
#     )
#     user_permissions = models.ManyToManyField(
#         'auth.Permission',
#         related_name='customuser_set',  
#         blank=True,
#     )

#     def __str__(self):
#         return self.username