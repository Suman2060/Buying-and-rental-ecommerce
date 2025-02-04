from django.urls import path, include
from account.views import TokenRefreshView, UserLoginView, UserProfileView, UserRegistrationView, UserChangePasswordView, SendPasswordResetEmailView, UserPasswordResetView, LogoutView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),  
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', UserChangePasswordView.as_view(), name='change_password'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send_reset_password_email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

