from django.urls import path
from . import views

app_name = "exercise"

urlpatterns = [
    path("", views.exercise, name="exercise"),
    path("bodyPartSession", views.bodyPartSession),
    path("storeSession", views.storeSession),
    path("startSession", views.startSession),
    path("sessionPractice", views.sessionPractice, name="sessionPractice"),
    # path("recordSession", views.recordSession),
]
