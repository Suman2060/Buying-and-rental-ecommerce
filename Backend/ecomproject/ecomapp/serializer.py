from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Products,Accessories,CartItem,Order,OrderItem,Cart
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import RentBike,BikeBooking
# serializer for product
class ProductSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)  # Explicitly defining _id

    class Meta:
        model = Products
        fields = ['_id', 'user', 'productname', 'image', 'productbrand', 'productcategory', 
                  'productinfo', 'price', 'stockcount', 'createdat']
# serializer for accessory
class AccessoriesSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(read_only=True)  # Explicitly defining _id

    class Meta:
        model = Accessories
        fields = ['_id', 'user', 'product', 'accessory_name', 'image', 'compatible_with', 
                  'material', 'brand', 'category', 'description', 'price', 
                  'stock_count', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']
        
class UserSerializerWithToken(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','username','email']
        
        

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(required=False, allow_null=True)
    accessory = AccessoriesSerializer(required=False, allow_null=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'accessory', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)  # Nested cart items
    user = serializers.StringRelatedField()  # Displays user as string

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer()
    user = serializers.StringRelatedField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'cart', 'total_price', 'order_date', 'status']
        

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(source="_id")  # 🔥 Map to `_id`
    accessory_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate(self, data):
        """Ensure either product_id or accessory_id is provided, not both"""
        product_id = data.get("product_id")
        accessory_id = data.get("accessory_id")

        if not product_id and not accessory_id:
            raise serializers.ValidationError("Either product_id or accessory_id must be provided.")
        if product_id and accessory_id:
            raise serializers.ValidationError("Only one of product_id or accessory_id should be provided.")

        return data
    
    
class UpdateCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=False)
    accessory_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField(min_value=0)

    def validate(self, data):
        """Ensure either product_id or accessory_id is provided"""
        product_id = data.get("product_id")
        accessory_id = data.get("accessory_id")

        if not product_id and not accessory_id:
            raise serializers.ValidationError("Either product_id or accessory_id must be provided.")
        if product_id and accessory_id:
            raise serializers.ValidationError("Only one of product_id or accessory_id should be provided.")

        return data
    

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(required=False, allow_null=True)
    accessory = AccessoriesSerializer(required=False, allow_null=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'accessory', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, source="orderitem_set", read_only=True)
    user = serializers.StringRelatedField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'order_date', 'status', 'items']

    def get_total_price(self, obj):
        """Calculate total order price"""
        return sum(item.price * item.quantity for item in obj.orderitem_set.all())


# Serializer for the rental Bike and its booking 

class RentBikeSerializer(serializers.ModelSerializer):
    # If RentBike model has an ImageField for the bike image
    bike_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = RentBike
        fields = '__all__'

class BikeBookingSerializer(serializers.ModelSerializer):
    # If BikeBooking model has an ImageField, for example, for booking-related images
    booking_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = BikeBooking
        fields = '__all__'