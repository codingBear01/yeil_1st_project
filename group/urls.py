from django.urls import path
from . import views

app_name = "group"

urlpatterns = [
    path("", views.allGroups, name="all_groups"),
    path("group/<int:group_id>", views.show, name="show"),
    path("create", views.create, name="create"),
    path("edit/<int:group_id>", views.edit, name="edit"),
    path("delete/<int:group_id>", views.delete, name="delete"),
    path("joinGroup", views.joinGroup),
    path("unjoinGroup", views.joinGroup),
    path("feeds/<int:user_id>/<str:showStatus>", views.showFeeds),
    path("search/", views.search, name="search"),
    path("groupLike", views.groupLike),
]
