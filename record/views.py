from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from user.models import User
from record.models import Record

# Create your views here.
@login_required
@csrf_exempt
def saveRecord(request):
    if request.method == "POST":
        userId = request.POST.get("userId")
        user = User.objects.get(pk=userId)
        saveDate = request.POST.get("saveDate")
        saveTotalTime = request.POST.get("saveTotalTime")
        saveName = request.POST.get("saveName")
        saveBodyParts = request.POST.get("saveBodyPart")
        saveCnts = request.POST.get("saveCnt")
        saveSets = request.POST.get("saveSet")
        saveEachTimes = request.POST.get("saveEachTime")

        record = Record(
            user=user,
            date=saveDate,
            totalTime=saveTotalTime,
            sessions=saveName,
            bodyParts=saveBodyParts,
            counts=saveCnts,
            sets=saveSets,
            eachTimes=saveEachTimes,
        )

        record.save()

        return JsonResponse(
            {
                "url": f"http://localhost:8000/userPage/{userId}",
                "status": 201,
            }
        )
    else:
        return JsonResponse({"error": "error"})
