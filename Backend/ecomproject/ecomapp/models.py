from django.db import models
# from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Products(models.Model):
    # user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Fixed on_delete
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    productname = models.CharField(max_length=220)
    image = models.ImageField(null=True, blank=True)
    productbrand = models.CharField(max_length=220, null=True, blank=True)
    productcategory = models.CharField(max_length=220, null=True, blank=True)
    productinfo = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    stockcount = models.IntegerField(null=True, blank=True, default=0)
    createdat = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.productname

# Accessories Model
class Accessories(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True, blank=True)  # Links accessory to a product (if needed)
    accessory_name = models.CharField(max_length=220)  # Name of the accessory
    image = models.ImageField(null=True, blank=True)  # Image of the accessory
    compatible_with = models.CharField(max_length=220, null=True, blank=True)  # Compatibility details (e.g., "All mountain bikes")
    material = models.CharField(max_length=220, null=True, blank=True)  # Material type (e.g., aluminum, carbon fiber)
    brand = models.CharField(max_length=220, null=True, blank=True)  # Brand of the accessory
    category = models.CharField(max_length=220, null=True, blank=True)  # Category (e.g., "Helmet", "Pedals", "Gloves")
    description = models.TextField(null=True, blank=True)  # Detailed description
    rating = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)  # Rating out of 5
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)  # Price of the accessory
    stock_count = models.IntegerField(null=True, blank=True, default=0)  # Available stock
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of creation
    _id = models.AutoField(primary_key=True, editable=False)  # Unique ID

    def __str__(self):
        return self.accessory_name

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Each user has a cart
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")  # Each cart has multiple items
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True, blank=True)
    accessory = models.ForeignKey(Accessories, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)  # Quantity of product/accessory

    def __str__(self):
        return f"{self.quantity} of {self.product or self.accessory}"