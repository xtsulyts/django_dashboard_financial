from rest_framework import serializers
from .models import Categoria, Transaccion, custom_user


class CustomUser(serializers.ModelSerializer):

    class Meta:
        model = custom_user
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

    

class TransaccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaccion
        fields = '__all__'

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser un número positivo.")
        return value
    

class TransaccionListSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    usuario_username = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = Transaccion
        fields = ['id', 'monto', 'fecha', 'descripcion', 'tipo', 'categoria', 'categoria_nombre', 'usuario', 'usuario_username']
    
