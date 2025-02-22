from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from django.conf import settings
# from django.contrib.auth.user.models import User




class Products(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

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

    def clean(self):
        if not self.productname:
            raise ValidationError("Product name is required.")
        if self.price is None or self.price <= 0:
            raise ValidationError("Product price must be greater than 0.")
        super().clean()

    def __str__(self):
        return self.productname

class Accessories(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True, blank=True)
    accessory_name = models.CharField(max_length=220)
    image = models.ImageField(null=True, blank=True)
    compatible_with = models.CharField(max_length=220, null=True, blank=True)
    material = models.CharField(max_length=220, null=True, blank=True)
    brand = models.CharField(max_length=220, null=True, blank=True)
    category = models.CharField(max_length=220, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    stock_count = models.IntegerField(null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def clean(self):
        if not self.accessory_name:
            raise ValidationError("Accessory name is required.")
        if self.price is None or self.price <= 0:
            raise ValidationError("Accessory price must be greater than 0.")
        super().clean()

    def __str__(self):
        return self.accessory_name

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Cart for {self.user.name}"

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, null=True, blank=True)
    accessory = models.ForeignKey(Accessories, on_delete=models.CASCADE, null=True, blank=True)
    productname = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    is_accessory = models.BooleanField(default=False)

    def clean(self):
        if not self.product and not self.accessory:
            raise ValidationError("Either a product or an accessory must be specified.")
        if self.product and self.accessory:
            raise ValidationError("Only one of `product` or `accessory` can be specified.")
        super().clean()

    def __str__(self):
        return f"{self.product or self.accessory} - {self.quantity}"

    def get_item_price(self):
        if self.product:
            return self.product.price * self.quantity
        elif self.accessory:
            return self.accessory.price * self.quantity
        return 0

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Completed", "Completed"), ("Cancelled", "Cancelled")],
        default="Pending"
    )

    def __str__(self):
        return f"Order {self.id} by {self.user.username} - {self.status}"

    def calculate_total_price(self):
        return sum(item.get_item_total_price() for item in self.items.all())

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True, blank=True)
    accessory = models.ForeignKey(Accessories, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def clean(self):
        if not self.product and not self.accessory:
            raise ValidationError("Either a product or an accessory must be specified.")
        if self.product and self.accessory:
            raise ValidationError("Only one of `product` or `accessory` can be specified.")
        super().clean()

    def __str__(self):
        return f"{self.quantity} of {self.product or self.accessory} in Order {self.order.id}"

    def get_item_total_price(self):
        return self.price_at_purchase * self.quantity

# Bike Rental System
class RentBike(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(null=True, blank=True)
    description = models.TextField()
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    total_rentals = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class BikeBooking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bike = models.ForeignKey(RentBike, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_approved = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.bike.name} ({self.start_date} to {self.end_date})"
