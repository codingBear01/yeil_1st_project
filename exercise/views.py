from django.shortcuts import render

from exercise.models import Session, RecommendSession, BodyPart

# Create your views here.
def exercise(request):
    sessions = Session.objects.all()
    recommendSessions = RecommendSession.objects.all()
    bodyParts = BodyPart.objects.all()

    return render(
        request,
        "session/session.html",
        {
            "sessions": sessions,
            "recommendSessions": recommendSessions,
            "bodyParts": bodyParts,
        },
    )
