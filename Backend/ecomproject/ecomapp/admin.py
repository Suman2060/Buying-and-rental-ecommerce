from django.contrib import admin
from ecomapp.models import Products,Accessories
# Register your models here.

admin.site.register(Products) #this add product table in admin side
admin.site.register(Accessories)

