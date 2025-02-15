from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from account.serializers import SendPasswordResetEmailSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer, UserChangePasswordSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import BasePermission
from django.contrib.auth import get_user_model  # Import the correct User model
    
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
        print("hello")
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
            token = TokenRefreshView.get_tokens_for_user(user)
            return Response({'Token': token, 'msg': 'Login Success'}, status=status.HTTP_200_OK)
        else:
            print("Authentication failed! Checking user existence...")

            # Get the correct User model
            User = get_user_model()
            try:
                test_user = User.objects.get(email=email)  # Now correctly referencing the User model
                print("User exists:", test_user)
                print("Stored password hash:", test_user.password)
                print("Trying to match password manually:", test_user.check_password(password))  # Should return True
            except User.DoesNotExist:  # Correct exception handling
                print("User does not exist!")

            return Response(
                {'errors': {'non_field_errors': ['Email or password does not match any registered user']}},
                status=status.HTTP_404_NOT_FOUND
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
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"msg": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)