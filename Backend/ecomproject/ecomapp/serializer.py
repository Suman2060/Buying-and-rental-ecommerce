from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products,Accessories
from rest_framework_simplejwt.tokens import RefreshToken

# serializer for product
class ProductSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)  # Explicitly defining _id

    class Meta:
        model = Products
        fields = ['_id', 'user', 'productname', 'image', 'productbrand', 'productcategory', 
                  'productinfo', 'rating', 'price', 'stockcount', 'createdat']
# serializer for accessory
class AccessoriesSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)  # Explicitly defining _id

    class Meta:
        model = Accessories
        fields = ['_id', 'user', 'product', 'accessory_name', 'image', 'compatible_with', 
                  'material', 'brand', 'category', 'description', 'rating', 'price', 
                  'stock_count', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']
        
class UserSerializerWithToken(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']