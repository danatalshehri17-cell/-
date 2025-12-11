# apps/users/utils.py
import random
from django.core.mail import send_mail
from django.conf import settings

def generate_otp():
    return str(random.randint(100000, 999999))

def send_code_to_user(email, code):
    subject = "Your ExamSim Verification Code"
    activation_url = f"http://localhost:8000/api/users/activate/?email={email}&code={code}"
    message = (
        f"Welcome to ExamSim AI! Your verification code is: {code}\n"
        f"Or click to activate: {activation_url}"
    )
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )