from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from exercise.models import Session, RecommendSession, BodyPart

# Create your views here.
def exercise(request):
    sessions = Session.objects.all()
    recommendSessions = RecommendSession.objects.all()
    bodyParts = BodyPart.objects.all()

    return render(
        request,
        "exercise/session.html",
        {
            "sessions": sessions,
            "recommendSessions": recommendSessions,
            "bodyParts": bodyParts,
        },
    )


@login_required
@csrf_exempt
def bodyPartSession(request):
    if request.method == "POST":
        bodyPart = request.POST.get("bodyPart")
        sessions = Session.objects.all().filter(bodyPart=bodyPart)
    else:
        return JsonResponse({"error": "error"}, status=400)

    return JsonResponse([session.serialize() for session in sessions], safe=False)
