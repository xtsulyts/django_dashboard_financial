from django.contrib import admin
from core.models import custom_user, Categoria, Transaccion



@admin.register(custom_user)
class CustomUserAdmin(admin.ModelAdmin):
    """
    Configuración personalizada para el modelo `custom_user` en el panel de administración.

    Hereda de `UserAdmin` para mantener las funcionalidades predeterminadas de Django
    relacionadas con la gestión de usuarios, como la autenticación y los permisos.
    """

    # Campos que se mostrarán en la lista de usuarios
    list_display = ('username', 'email', 'is_staff', 'is_active')
    
    # Campos por los que se puede buscar
    search_fields = ('username', 'email')
    
    # Filtros laterales
    list_filter = ('is_staff', 'is_active', 'groups')
    
    # Campos que se mostrarán en el formulario de edición
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('user', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Campos que se mostrarán en el formulario de creación
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

# Registra el modelo Categoria
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion')  # Campos que se mostrarán en la lista
    search_fields = ('nombre',)  # Campos por los que se puede buscar

# Registra el modelo Transaccion
@admin.register(Transaccion)
class TransaccionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'monto', 'fecha', 'categoria', 'tipo')  # Campos que se mostrarán en la lista
    list_filter = ('tipo', 'categoria')  # Filtros laterales
    search_fields = ('descripcion', 'usuario__username')  # Campos por los que se puede buscar