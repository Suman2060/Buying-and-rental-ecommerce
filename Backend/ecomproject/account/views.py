from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from account.serializers import SendPasswordResetEmailSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, UserChangePasswordSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model # Import the correct User model
from rest_framework.exceptions import ValidationError  
class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
    
class TokenRefreshView():
    def get_tokens_for_user(user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        # Debugging: print the received data
        print("Received registration data:", request.data)

        # Create the serializer with the received data
        serializer = UserRegistrationSerializer(data=request.data)

        # Check if the data is valid
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)  # Log errors for debugging
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors if validation fails
        
        # If valid, save the user and generate a token
        user = serializer.save()

        # Ensure to get tokens for the user
        token = TokenRefreshView.get_tokens_for_user(user)

        # Respond with the token and success message
        return Response({'token': token, 'message': 'User registration successful.'}, status=status.HTTP_201_CREATED)



class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        print("Received login request data:", request.data)

        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')

        print("Validated email:", email)
        print("Validated password:", password)

        user = authenticate(request, email=email, password=password)

        if user is not None:
            print("User authenticated successfully:", user)

            # Generate access and refresh tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            return Response(
                {
                    "accessToken": access_token,
                    "refreshToken": refresh_token,
                    "msg": "Login Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            print("Authentication failed! Checking user existence...")

            # Get the correct User model
            User = get_user_model()
            try:
                test_user = User.objects.get(email=email)
                print("User exists:", test_user)
                print("Stored password hash:", test_user.password)
                print("Trying to match password manually:", test_user.check_password(password))
            except User.DoesNotExist:
                print("User does not exist!")

            return Response(
                {"errors": {"non_field_errors": ["Email or password does not match any registered user"]}},
                status=status.HTTP_404_NOT_FOUND,
            )

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Changed Successfully.'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=True):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Link sent. Please check your email.'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid': uid, 'token': token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg': 'Password Reset Successfully.'}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            # Ensure refresh token is provided
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                raise ValidationError("Refresh token is required.")

            token = RefreshToken(refresh_token)
            # Blacklist the refresh token
            token.blacklist()

            return Response({"msg": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)

        except ValidationError as e:
            return Response({"msg": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"msg": "An error occurred while logging out."}, status=status.HTTP_400_BAD_REQUEST)