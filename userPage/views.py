from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from user.models import User
from feed.models import Feed

# Create your views here.
def userPage(request, user_id):
    if request.user.is_authenticated:
        user = User.objects.get(id=user_id)
        feeds = Feed.objects.all().filter(author_id=user_id)
        return render(
            request,
            "userPage/userPage.html",
            {
                "user": user,
                "feeds": feeds,
            },
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


@login_required
@csrf_exempt
def follow(request):
    if request.method == "POST":
        user = request.POST.get("user")
        action = request.POST.get("action")

        if action == "follow":
            try:
                # FOLLOW
                user = User.objects.get(pk=user)
                loggedUser = User.objects.get(pk=request.user.id)
                loggedUser.following.add(user)
                loggedUser.save()

                user.follower.add(loggedUser)
                user.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "unfollow",
                        "followerCnt": user.follower.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
        else:
            try:
                # UNFOLLOW
                user = User.objects.get(pk=user)
                loggedUser = User.objects.get(pk=request.user.id)
                loggedUser.following.remove(user)
                loggedUser.save()

                user.follower.remove(loggedUser)
                user.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "follow",
                        "followerCnt": user.follower.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
    return JsonResponse({}, status=400)


@login_required
def showFollow(request, user_id, showStatus):
    if request.user.is_authenticated:
        user = User.objects.get(pk=user_id)

    if showStatus == "followers":
        follows = user.follower.all()
    elif showStatus == "followings":
        follows = user.following.all()
    else:
        return JsonResponse({"error": "Invalid followers"}, status=400)

    return JsonResponse([follow.serialize() for follow in follows], safe=False)


@login_required
@csrf_exempt
def deleteFollower(request):
    if request.method == "POST":
        user = request.POST.get("user")
        action = request.POST.get("action")

        if action == "삭제":
            try:
                user = User.objects.get(pk=user)
                loggedUser = User.objects.get(pk=request.user.id)

                user.following.remove(loggedUser)
                loggedUser.follower.remove(user)
                user.save()
                loggedUser.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "되돌리기",
                        "followerCnt": loggedUser.follower.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
        else:
            try:
                user = User.objects.get(pk=user)
                loggedUser = User.objects.get(pk=request.user.id)

                user.following.add(loggedUser)
                loggedUser.follower.add(user)
                user.save()
                loggedUser.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "삭제",
                        "followerCnt": loggedUser.follower.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
    return JsonResponse({}, status=400)


def showFeeds(request, user_id, showStatus):
    if request.user.is_authenticated:
        user = User.objects.get(pk=user_id)

    if showStatus == "mine":
        feeds = Feed.objects.all().filter(author_id=user)
    elif showStatus == "followings":
        followings = User.objects.get(pk=user_id).following.all()
        feeds = Feed.objects.filter(author__in=followings).order_by("-createdTime")
    else:
        return JsonResponse({"error": "error"}, status=400)

    return JsonResponse([feed.serialize() for feed in feeds], safe=False)
