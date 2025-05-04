"""
URL configuration for ecomproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.urls import path
from .views import VerifyKhaltiPayment
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



urlpatterns = [
    path('', views.getRoutes,name="getRoutes"),
    path('api/product/',views.getProduct,name="getProduct"),
    path('api/accessories/', views.getAccessories, name='getAccessories'),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/',views.getUserProfile,name="getUserProfile"),
    path('image/', views.getimage, name='get_image'),
    path('api/accessories/<int:id>/', views.getAccessoryDetail, name='accessory-detail'),
    path('api/product/<int:id>/', views.getProductDetail, name='product-detail'),
    
    # ✅ Order Endpoints
    path("orders/", views.get_user_orders, name="user_orders"),
    path("checkout/", views.checkout, name="checkout"),
    # 🛒 Cart Endpoints
    path("cart/", views.view_cart, name="view_cart"),  # Get current cart items
    path("cart/add/", views.add_to_cart, name="add_to_cart"),  # Correct endpoint
    path("cart/view/", views.view_cart, name="view_cart"),  # Fetch cart items
    path('cart/update/', views.update_cart_item, name='update-cart'),  # Update item quantity
    path("cart/remove/", views.remove_from_cart, name="remove_from_cart"),  # Remove item from cart
     # API to list available bikes for rent (accessible by everyone)
    path('bikes/', views.rent_bike_list, name='rent-bike-list'),
    
    # API to create a new bike booking (accessible by authenticated users only)
    path('rentals/bikes/', views.create_bike_booking, name='create_bike_booking'),  # Add this line
    
    # API to list all bike bookings (admin only)
    path('admin/rentals/', views.user_bike_booking_list, name='bike-booking-list'),
    
    
    path('verify_payment/', views.PaymentVerificationView.as_view(), name='verify_payment'),
    path('khalti/verifypayment/',VerifyKhaltiPayment.as_view(), name='verify_payment'),
    
    #url for sending email for booking
    path('send-booking-email/', views.send_booking_email, name='send-booking-email'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)