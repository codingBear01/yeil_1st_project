from django.urls import path
from . import views

app_name = "feed"

urlpatterns = [
    path("", views.allFeeds, name="all_feeds"),
    path("feed/<int:feed_id>", views.show, name="show"),
    path("create", views.create, name="create"),
    path("edit/<int:feed_id>", views.edit, name="edit"),
    path("delete/<int:feed_id>", views.delete, name="delete"),
    path("feedLike", views.feedLike),
]
