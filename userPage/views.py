from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout


from user.models import User
from feed.models import Feed

# Create your views here.
## logged in user.id랑 params user_id랑 일치하면 기능 구현 if not? err page
def userPage(request, user_id):
    if request.user.is_authenticated:
        user = User.objects.get(id=user_id)
        return render(
            request,
            "userPage/userPage.html",
            {"user": user},
        )

    return render(request, "userPage/userPage.html")


def editUserInfo(request, user_id):
    if request.user.is_authenticated:
        user = User.objects.get(id=user_id)

        if request.method == "POST":
            password = request.POST.get("user_password")
            confirmation = request.POST.get("user_confirmation")
            profilePic = request.FILES.get("user_profile_pic")

            if password != confirmation:
                return render(
                    request,
                    "userPage/editUserInfo.html",
                    {"pwError": "Passwords must match."},
                )

            user.password = make_password(password)
            user.profilePic = profilePic

            user.save()

            if user is not None:
                login(request, user)
                return render(request, "userPage/userPage.html")
            else:
                return render(request, "user/login.html")
        return render(request, "userPage/editUserInfo.html", {"user": user})

    return render(request, "userPage/userPage.html")


def showFollowers(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        return render(request, "userPage/follower.html", {"user": user})

    return render(request, "userPage/userPage.html")


def showFollowings(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        return render(request, "userPage/following.html", {"user": user})

    return render(request, "userPage/userPage.html")


def showUserFeeds(request, user_id):
    if request.user.is_authenticated:
        user = User.objects.get(id=user_id)
        feeds = Feed.objects.all().filter(author_id=user.id)
        return render(
            request,
            "userPage/userFeeds.html",
            {
                "user": user,
                "feeds": feeds,
            },
        )

    return render(request, "userPage/userPage.html")


def showFollowingFeeds(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        feeds = Feed.objects.all().filter(author_id=request.user.id)
        return render(
            request,
            "userPage/followingFeeds.html",
            {
                "user": user,
                "feeds": feeds,
            },
        )

    return render(request, "userPage/userPage.html")
