from django.shortcuts import get_object_or_404, render
# from .product import products  # Importing the existing products list
from .models import Products,Accessories
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import ProductSerializer,AccessoriesSerializer,UserSerializer,UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.permissions import IsAuthenticated

from rest_framework.permissions import IsAuthenticated
# Create your views here.

#these are the api to get all products
# @api_view(['GET'])
# def getProduct(request):
#     products=Products.objects.all()
#     serializer=ProductSerializer(products,many=True)
#     # Use the imported products list
#     return Response(serializer.data)
@api_view(['GET'])
def getProduct(request):
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def getProductDetail(request, id):
    product = get_object_or_404(Products, _id=id)
    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def getAccessories(request):
    accessories = Accessories.objects.all()
    serializer = AccessoriesSerializer(accessories, many=True, context={'request': request})
    return Response(serializer.data)

#  API to get accessory details by ID
@api_view(['GET'])
def getAccessoryDetail(request, id):
    accessory = get_object_or_404(Accessories, _id=id)# Fetch the accessory by ID
    serializer = AccessoriesSerializer(accessory, context={'request': request})# Serialize the accessory object
    return Response(serializer.data) # Return the serialized data as a Response

@api_view(['GET'])
def getimage(request):
    images = Products.objects.all()
    serializer = ProductSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def getRoutes(request):
    return Response("hello suman")

# @api_view(['GET'])
# def getProducts(request):
#     products = Products.objects.all()
#     serializer=ProductSerializer(products,many=True)
#     return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.first_name  # Use 'first_name' or 'get_full_name()'
        token['email'] = user.email  # Ensure this exists
        # ...

        return token
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data=super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v
        
        return data
        



@api_view(['GET'])

def getUserProfile(request):
    user = request.user  # This should be the authenticated user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer
 