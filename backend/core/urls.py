from django.urls import path
from .views import  login_user, index, user_profile

urlpatterns = [
    path("", index, name="index"),
    path("login_user/", login_user, name="login_user"), 
    path("user_profile/", user_profile, name="user_profile") 
   ]
