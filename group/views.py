from argparse import Action
from dataclasses import fields
from os import stat
from telnetlib import STATUS
from unicodedata import category
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.db.models import Q
import pkg_resources


from user.models import User
from feed.models import Feed
from group.models import Group


# Create your views here.
def allGroups(request):
    groups = Group.objects.all()
    return render(request, "group/groups.html", {"groups": groups})


def show(request, group_id):
    group = Group.objects.get(pk=group_id)
    return render(request, "group/group.html", {"group": group})


def create(request):
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)

        if request.method == "POST":
            target = request.POST["create_target"]
            title = request.POST["create_title"]
            content = request.POST["create_content"]
            memberCount = request.POST["create_memberCount"]
            startDay = request.POST["create_startDay"]
            finishDay = request.POST["create_finishDay"]
            groupPic = request.FILES.get("create_groupPic")

            group = Group(
                user=user,
                target=target,
                title=title,
                content=content,
                memberCount=memberCount,
                startDay=startDay,
                finishDay=finishDay,
                groupPic=groupPic,
            )

            group.save()
            return redirect("group:all_groups")
        return render(request, "group/create.html")
    try:
        group.groupPic = request.FILES["groupPic"]
    except:
        group.groupPic = None
    else:
        return render(request, "user/login.html")


def edit(request, group_id):
    if request.user.is_authenticated:
        group = Group.objects.get(pk=group_id)
        test = Group.objects.all().filter(user_id=request.user.id)

        if request.method == "POST":
            target = request.POST["target"]
            title = request.POST["title"]
            content = request.POST["content"]
            memberCount = request.POST["memberCount"]
            startDay = request.POST["startDay"]
            finishDay = request.POST["finishDay"]
            groupPic = request.FILES.get("groupPic")

            if startDay == "" or finishDay == "":
                return render(
                    request, "group/edit.html", {"group": group, "err": "날짜를 선택해주세요."}
                )

            group.target = target
            group.title = title
            group.content = content
            group.memberCount = memberCount
            group.startDay = startDay
            group.finishDay = finishDay
            group.groupPic = groupPic

            group.save()

            return redirect("group:all_groups")
    try:
        group.groupPic = request.FILES["groupPic"]
    except:
        group.groupPic = None
        return render(request, "group/edit.html", {"group": group, "test": test})
    else:
        return render(request, "user/login.html")


def delete(request, group_id):
    if request.user.is_authenticated:
        group = Group.objects.get(pk=group_id)

        if request.method == "POST":
            group.delete()
            return redirect("group:all_groups")
        return render(request, "group/editGroup.html", {"group": group})
    else:
        return render(request, "user/login.html")


# GROUPJOIN부분
@login_required
@csrf_exempt
def joinGroup(request):
    if request.method == "POST":
        groupId = request.POST.get("groupId")
        action = request.POST.get("action")

        if action == "참가":
            try:
                # JOINGROUP
                group = Group.objects.get(pk=groupId)
                loggedUser = User.objects.get(pk=request.user.pk)
                group.joinedUser.add(loggedUser)

                group.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "탈퇴",
                        "joinGroupCnt": group.joinedUser.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
        else:
            try:
                # UNJOINGROUP
                group = Group.objects.get(pk=groupId)
                loggedUser = User.objects.get(pk=request.user.pk)
                group.joinedUser.remove(loggedUser)

                group.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "참가",
                        "joinGroupCnt": group.joinedUser.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
    return JsonResponse({}, status=400)


@login_required
def showjoinGroup(request, user_id, showStatus):
    if request.user.is_authenticated:
        user = User.objects.get(pk=user_id)

    if showStatus == "joinGroups":
        joinUser = user.joinGroup.all()
    elif showStatus == "unjoinGroups":
        joinUser = user.unjoinGroup.all()
    else:
        return JsonResponse({"error": "Invalid Groups"}, status=400)

    return JsonResponse([joinGroup.serialize() for joinGroup in joinUser], safe=False)


@login_required
@csrf_exempt
def unjoinGroup(request):
    if request.method == "POST":
        user = request.POST.get("user")
        action = request.POST.get("action")

        if action == "그룹탈퇴":
            try:
                user = User.objects.get(pk=user)
                loggedUser = User.objects.get(pk=request.user.id)

                user.joinGroup.remove(loggedUser)
                loggedUser.unjoinGroup.remove(user)
                user.save()
                loggedUser.save()

                return JsonResponse(
                    {
                        "status": 201,
                        "action": "되돌리기",
                        "joinGroupCnt": loggedUser.joinUser.count(),
                    },
                    status=201,
                )
            except:
                return JsonResponse({"error": "error"}, status=404)
    else:
        try:
            user = User.objects.get(pk=user)
            loggedUser = User.objects.get(pk=request.user.id)

            user.joinGroup.add(loggedUser)
            loggedUser.joinGroup.add(user)
            user.save()
            loggedUser.save()

            return JsonResponse(
                {
                    "status": 201,
                    "action": "그룹탈퇴",
                    "joinGroupCnt": loggedUser.joinGroup.count(),
                },
                status=201,
            )
        except:
            return JsonResponse({"error": "error"}, status=404)
    return JsonResponse({}, status=400)


# 검색기능
def search(request):
    groups = Group.objects.all()
    search = request.GET.get("search", "")
    if search:
        search = groups.filter(
            Q(target__icontains=search)
            | Q(title__icontains=search)
            | Q(content__icontains=search)
        )
        return render(
            request, "group/search.html", {"groups": groups, "search": search}
        )
    else:
        return render(request, "group/search.html", {})


@csrf_exempt
def groupLike(request):
    if request.method == "POST":
        groupId = request.POST.get("groupId")
        groupIsLiked = request.POST.get("groupIsLiked")

        try:
            group = Group.objects.get(pk=groupId)
            if groupIsLiked == "no":
                group.like.add(request.user)
                groupIsLiked = "yes"
            else:
                group.like.remove(request.user)
                groupIsLiked = "no"

            group.save()

            return JsonResponse(
                {
                    "groupLikeCnt": group.like.count(),
                    "groupIsLiked": groupIsLiked,
                    "status": 201,
                },
                status=201,
            )
        except:
            return JsonResponse(
                {
                    "error": "Group not found",
                    "status": 404,
                },
                status=404,
            )

    return JsonResponse({}, status=400)
