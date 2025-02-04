from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products,Accessories
from rest_framework_simplejwt.tokens import RefreshToken

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model=Products
        fields = '__all__'

#accessories serializer
class AccessoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accessories
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']
        
class UserSerializerWithToken(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']