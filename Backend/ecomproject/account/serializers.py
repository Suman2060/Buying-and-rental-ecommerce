from django.forms import ValidationError
from rest_framework import serializers
from account.models import User
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=False)
    tc = serializers.BooleanField(required=False, default=False)  # Make tc optional with a default value

    class Meta:
        model = User
        fields = ['name', 'email', 'password', 'password2', 'tc']
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True, 'required': False}  # Explicitly mark password2 as optional
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')

        if password and password2 and password != password2:
            raise serializers.ValidationError("Password and confirm password don't match")

        return data

    def create(self, validated_data):
        validated_data.pop('password2', None)  # Ensure password2 is not passed when creating the user
        user = User.objects.create_user(**validated_data)
        return user





class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'email', 'name']  

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    # class Meta:
    #     fields = ['password', 'password2']
        
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')
        
        if password != password2:
            raise serializers.ValidationError("Password and confirm password doesn't match")
        
        user.set_password(password)
        user.save()
        return data 
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ['email']
    
    def validate(self, data):
        email = data.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded uid: ', uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print('Password Reset Token: ', token)
            link = 'http://localhost:3000/api/user/reset-password/'+uid+'/'+token
            print('Password Reset Link', link)
            
            # Send email
            body = 'Click Following Link To Reset Your Password '+link
            data = {
                'subject': 'Reset Your Password',
                'body': body,
                'to_email': user.email
            }
            Util.send_email(data)
            return data
        else:
            raise ValidationError('You are not a registered user.')
        return super().validate(data) 
    
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    class Meta:
        fields = ['password', 'password2']
        
    def validate(self, data):
        try:
            password = data.get('password')
            password2 = data.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            
            if password != password2:
                raise serializers.ValidationError("Password and confirm password doesn't match")
            
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError('Token is not valid or expired.')
            
            user.set_password(password)
            user.save() 
            return data 
        except DjangoUnicodeDecodeError as e: 
            PasswordResetTokenGenerator().check_token(user, token)
            raise ValidationError('Token is not valid or expired.', e)
