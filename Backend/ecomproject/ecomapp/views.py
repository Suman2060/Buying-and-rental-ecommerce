from django.shortcuts import get_object_or_404, render
# from .product import products  # Importing the existing products list
from .models import Products,Accessories,Cart,CartItem,Order,OrderItem
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from .serializer import ProductSerializer,AccessoriesSerializer,UserSerializer,UserSerializerWithToken,CartItemSerializer,OrderSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework_simplejwt.authentication import JWTAuthentication 
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from rest_framework import status
from rest_framework.exceptions import PermissionDenied,NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import logging
from .models import RentBike,BikeBooking
from .serializer import BikeBookingSerializer,RentBikeSerializer
from django.conf import settings
from rest_framework.views import APIView
# Create your views here.

#these are the api to get all products
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
 
 
 
# this is api for cart and order
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """Fetches past orders of the authenticated user"""
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def checkout(request):
    """Move cart items to an order"""
    user = request.user
    cart, created = Cart.objects.get_or_create(user=user)
    
    if not cart.items.exists():
        return Response({"message": "Cart is empty"}, status=400)

    # Create an order
    order = Order.objects.create(user=user, status="Completed")

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            accessory=item.accessory,
            quantity=item.quantity,
            price=item.product.price if item.product else item.accessory.price,
        )

    # Clear the cart
    cart.items.all().delete()
    return Response({"message": "Order placed successfully", "order_id": order.id})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    item_id = request.data.get("item_id")      # Item ID (could be product or accessory)
    item_type = request.data.get("item_type")    # "product" or "accessory"
    item_name = request.data.get("item_name")    # Name of the item
    item_price = request.data.get("item_price")  # Price of the item
    quantity = request.data.get("quantity", 1)   # Default quantity

    # Validate required parameters
    if not item_id or not item_type:
        return Response({"error": "Item ID and item type are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if item_type not in ["product", "accessory"]:
        return Response({"error": "Invalid item type. Valid values: 'product' or 'accessory'."}, status=status.HTTP_400_BAD_REQUEST)

    if quantity <= 0:
        return Response({"error": "Quantity must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch the item from the correct model
    if item_type == "product":
        try:
            item = Products.objects.get(_id=item_id)
        except Products.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    else:  # item_type == "accessory"
        try:
            item = Accessories.objects.get(_id=item_id)
        except Accessories.DoesNotExist:
            return Response({"error": "Accessory not found"}, status=status.HTTP_404_NOT_FOUND)

    # Create or update CartItem using the correct field
    if item_type == "product":
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            product=item,  # Use the product field
            defaults={
                "productname": item_name,
                "product_price": item_price,
                "quantity": quantity,
                "is_accessory": False,
            }
        )
    else:  # item_type == "accessory"
        cart_item, created = CartItem.objects.get_or_create(
            user=user,
            accessory=item,  # Use the accessory field
            defaults={
                "productname": item_name,
                "product_price": item_price,
                "quantity": quantity,
                "is_accessory": True,
            }
        )

    # If the item already exists, update the quantity
    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({
        "message": "Item added to cart",
        "cart_item": {
            "id": cart_item.id,
            "item_name": cart_item.productname,
            "item_price": cart_item.product_price,
            "quantity": cart_item.quantity,
        }
    }, status=status.HTTP_201_CREATED)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    user = request.user
    cart_items = CartItem.objects.filter(user=user)

    if not cart_items.exists():
        return Response({"message": "Your cart is empty"}, status=status.HTTP_200_OK)

    # Prepare the data for cart items
    cart_data = []
    total_price = 0

    for item in cart_items:
        cart_item_data = {}

        if item.is_accessory:
            # Accessory-related fields
            accessory = item.accessory
            cart_item_data = {
                "id": item.id,
                "is_accessory": True,
                "accessory": {
                    "accessory_name": accessory.accessory_name,
                    "brand": accessory.brand,
                    "price": accessory.price,
                    "image": accessory.image.url if accessory.image else None,
                },
                "quantity": item.quantity
            }
            total_price += accessory.price * item.quantity
        else:
            # Product-related fields
            product = item.product
            cart_item_data = {
                "id": item.id,
                "is_accessory": False,
                "product": {
                    "product_name": product.productname,
                    "brand": product.productbrand,
                    "price": product.price,
                    "image": product.image.url if product.image else None,
                },
                "quantity": item.quantity
            }
            total_price += product.price * item.quantity
        
        cart_data.append(cart_item_data)

    return Response({
        "cart_items": cart_data,
        "total_price": total_price
    })



@api_view(["POST"])  # Ensuring correct HTTP method
def update_cart_item(request):
    product_id = request.data.get("product_id")
    quantity = request.data.get("quantity", 1)

    if not product_id:
        return Response({"error": "Product ID is required"}, status=400)

    try:
        cart_item = CartItem.objects.get(product_id=product_id)
    except CartItem.DoesNotExist:
        return Response({"error": "Item not in cart"}, status=404)

    if quantity > 0:
        cart_item.quantity = quantity
        cart_item.save()
    else:
        cart_item.delete()  # Remove if quantity is zero

    return Response({"message": "Cart updated successfully"})


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
import json
from .models import CartItem, Products, Accessories


@api_view(['DELETE'])
def remove_from_cart(request):
    try:
        # 🔹 Parse request body manually for DELETE requests
        data = json.loads(request.body.decode('utf-8')) 

        item_id = data.get("item_id")
        item_name = data.get("item_name")
        item_type = data.get("item_type")

        # 🔸 Validate required fields
        if not item_id and not item_name:
            return Response({"error": "Either Item ID or Item Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if item_type not in ["product", "accessory"]:
            return Response({"error": "Invalid item type. Must be 'product' or 'accessory'."}, status=status.HTTP_400_BAD_REQUEST)

        # 🔹 Retrieve and delete item from cart
        if item_type == "product":
            item = Products.objects.get(_id=item_id) if item_id else Products.objects.get(productname=item_name)
            cart_item = CartItem.objects.filter(product=item).first()
        else:  # item_type == "accessory"
            item = Accessories.objects.get(_id=item_id) if item_id else Accessories.objects.get(accessory_name=item_name)
            cart_item = CartItem.objects.filter(accessory=item).first()

        if not cart_item:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

    except (Products.DoesNotExist, Accessories.DoesNotExist):
        return Response({"error": "Item does not exist"}, status=status.HTTP_404_NOT_FOUND)
    except json.JSONDecodeError:
        return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)


# api for displayong rental bike availables 
@api_view(['GET'])
@permission_classes([AllowAny])  # Allow anyone (authenticated or not) to access
def rent_bike_list(request):
    """
    List all available bikes for rent (accessible to both authenticated and unauthenticated users).
    """
    bikes = RentBike.objects.filter(is_available=True)
    serializer = RentBikeSerializer(bikes, many=True)
    return Response(serializer.data)

# Create a new bike booking
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_bike_booking(request):
    """
    Create a booking for a bike (only for authenticated users).
    """
    logging.debug("Request data: %s",request.data)
    if request.method == 'POST':
        # Check if the bike exists and is available
        bike_id = request.data.get('bike')
        try:
            bike = RentBike.objects.get(id=bike_id, is_available=True)
        except RentBike.DoesNotExist:
            raise NotFound("The requested bike is either unavailable or doesn't exist.")
        
        # Now proceed with creating the booking
        serializer = BikeBookingSerializer(data=request.data)
        if serializer.is_valid():
            # Save the booking with the logged-in user
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List all bookings (Admin only)
@api_view(['GET'])
def rent_bike_list(request):
    bikes = RentBike.objects.filter(is_available=True)
    serializer = RentBikeSerializer(bikes, many=True)
    return Response(serializer.data)

# Create a new bike booking (only accessible to logged-in users)
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from .models import RentBike, BikeBooking
from django.contrib.auth.decorators import login_required



# Create a new bike booking
from datetime import datetime
from django.utils.dateparse import parse_date
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import NotFound, ValidationError
from .models import RentBike
import logging

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_bike_booking(request):
    """
    Create a booking for a bike (only for authenticated users).
    """
    logging.debug("Request data: %s", request.data)
    
    if request.method == 'POST':
        # Extract bike ID, start date, and end date from request data
        bike_id = request.data.get('bike')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Validate date format and parse them
        start_date_obj = parse_date(start_date)
        end_date_obj = parse_date(end_date)

        if not start_date_obj or not end_date_obj:
            raise ValidationError("Invalid date format. Please provide valid start and end dates.")
        
        if end_date_obj <= start_date_obj:
            raise ValidationError("End date must be after start date.")

        try:
            # Fetch the bike, ensuring it is available
            bike = RentBike.objects.get(id=bike_id, is_available=True)
        except RentBike.DoesNotExist:
            raise NotFound("The requested bike is either unavailable or doesn't exist.")
        
        # Calculate the total price
        days_rented = (end_date_obj - start_date_obj).days
        if days_rented <= 0:
            raise ValidationError("Rental period must be greater than zero.")
        
        total_price = bike.price_per_day * days_rented

        # Now proceed with creating the booking
        booking_data = {
            'user': request.user.id,
            'bike': bike.id,
            'start_date': start_date_obj,
            'end_date': end_date_obj,
            'total_price': total_price,
        }

        # Serialize and save the booking
        serializer = BikeBookingSerializer(data=booking_data)
        if serializer.is_valid():
            # Save the booking with the logged-in user
            booking = serializer.save(user=request.user)
            logging.info("Booking created successfully: %s", booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        logging.error("Error creating booking: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List all bookings for a specific user (accessible only to the logged-in user)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bike_booking_list(request):
    bookings = BikeBooking.objects.filter(user=request.user)
    serializer = BikeBookingSerializer(bookings, many=True)
    return Response(serializer.data)

# List all bookings for a specific user (accessible only to the logged-in user)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bike_booking_list(request):
    bookings = BikeBooking.objects.filter(user=request.user)
    serializer = BikeBookingSerializer(bookings, many=True)
    return Response(serializer.data)

# Update the status of a bike booking (only accessible to admins)
from django.db import IntegrityError

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_bike_booking_status(request, booking_id):
    try:
        booking = BikeBooking.objects.get(id=booking_id)
    except BikeBooking.DoesNotExist:
        return Response({"detail": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    # Handling the IntegrityError here
    try:
        serializer = BikeBookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except IntegrityError as e:
        # Return a custom error response if an IntegrityError occurs
        return Response({"detail": "IntegrityError: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)





# api for handling payment verifcation
class PaymentVerificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        payment_id = request.data.get('payment_id')
        amount = request.data.get('amount')

        if not payment_id or not amount:
            return Response({"error": "Missing required parameters."}, status=400)

        # Get the secret key from settings
        secret_key = settings.KHALTI_SECRET_KEY  

        verification_url = "https://khalti.com/api/v2/payment/verify/"

        payload = {
            'token': payment_id,  
            'amount': amount,  
        }

        headers = {
            'Authorization': f"Key {secret_key}",  
        }

        try:
            response = request.post(verification_url, data=payload, headers=headers)
            data = response.json()

            if response.status_code == 200:
                return Response({"message": "Payment verified successfully!", "data": data}, status=200)
            else:
                return Response({"error": "Payment verification failed.", "details": data}, status=400)

        except request.exceptions.RequestException as e:
            return Response({"error": "Payment verification request failed.", "details": str(e)}, status=500)