from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import custom_user


class register_user_form(UserCreationForm): 
    class Meta:
        model = custom_user
        fields = ('username', 'email', 'password1', 'password2')


# class register_user(forms.Form): 
#     class Meta:
#         model = custom_user_0
#         fields = ('username', 'email', 'password1', 'password2')