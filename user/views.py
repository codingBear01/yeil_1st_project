from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.db import IntegrityError


from .models import User


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        userId = request.POST.get("user_id")
        userPw = request.POST.get("user_pw")
        user = authenticate(request, username=userId, password=userPw)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("main:index"))
        else:
            return render(
                request,
                "user/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "user/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("main:index"))


def register(request):
    if request.method == "POST":
        username = request.POST.get("user_id")
        email = request.POST.get("user_email")
        nickname = request.POST.get("user_nickname")
        profilePic = request.FILES["user_profile_pic"]

        # Ensure password matches confirmation
        password = request.POST.get("user_pw")
        confirmation = request.POST.get("user_confirmation")
        if password != confirmation:
            return render(
                request, "user/register.html", {"pwError": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.nickname = nickname
            user.profilePic = profilePic
            user.save()
        except IntegrityError:
            return render(
                request, "user/register.html", {"idError": "Username already taken."}
            )
        login(request, user)
        return HttpResponseRedirect(reverse("user:login"))
    else:
        return render(request, "user/register.html")
