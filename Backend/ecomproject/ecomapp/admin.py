from django.contrib import admin
from ecomapp.models import Products,Accessories,Cart,RentBike,BikeBooking,CartItem
from django.forms import ValidationError
# Register your models here.

admin.site.register(Products) #this add product table in admin side
admin.site.register(Accessories)
admin.site.register(Cart)
admin.site.register(CartItem)
# RentBike model registration

admin.site.register(RentBike)
class BikeBookingAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        try:
            # Ensure the related bike exists
            RentBike.objects.get(id=obj.bike.id)
        except RentBike.DoesNotExist:
            raise ValidationError("This bike does not exist.")
        super().save_model(request, obj, form, change)

admin.site.register(BikeBooking, BikeBookingAdmin)
# admin.site.register(Accessories)

