# apps/users/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from .serializers import RegisterSerializer, VerifyEmailSerializer
from .utils import generate_otp, send_code_to_user
from django.http import HttpResponse

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate and Save Code
            code = generate_otp()
            user.verification_code = code
            user.save()
            
            # Send Email
            try:
                send_code_to_user(user.email, code)
                return Response({
                    "message": "User registered. Check email for code.",
                    "email": user.email
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                # If email fails, delete user so they can try again
                user.delete()
                return Response({"error": "Failed to send email."}, status=500)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyCodeView(APIView):
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            code = serializer.validated_data['code']
            
            try:
                user = User.objects.get(email=email)
                if user.verification_code == code:
                    user.is_active = True
                    user.is_verified = True
                    user.verification_code = None  # Clear code after use
                    user.save()
                    return Response({"message": "Account verified successfully!"}, status=200)
                else:
                    return Response({"error": "Invalid code"}, status=400)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        
        return Response(serializer.errors, status=400)

class ActivateView(APIView):
    def get(self, request):
        email = request.GET.get('email')
        code = request.GET.get('code')
        if not email or not code:
            return Response({'error': 'Missing email or code.'}, status=400)
        try:
            user = User.objects.get(email=email)
            if user.verification_code == code:
                user.is_active = True
                user.is_verified = True
                user.verification_code = None
                user.save()
                return HttpResponse('<h2>Account activated successfully!</h2>', status=200)
            else:
                return HttpResponse('<h2>Invalid activation code.</h2>', status=400)
        except User.DoesNotExist:
            return HttpResponse('<h2>User not found.</h2>', status=404)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'error': 'Email and password required.'}, status=400)
        user = authenticate(username=email, password=password)
        if user is not None:
            if user.is_active and user.is_verified:
                return Response({'message': 'Login successful.'}, status=200)
            else:
                return Response({'error': 'Account not activated.'}, status=403)
        else:
            return Response({'error': 'Invalid credentials.'}, status=401)