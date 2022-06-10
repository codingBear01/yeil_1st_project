from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "userPage"

urlpatterns = [
    path("<int:user_id>", views.userPage, name="userPage"),
    path("editUserInfo/<int:user_id>", views.editUserInfo, name="editUserInfo"),
    path("follow/<int:user_id>/<str:showStatus>", views.showFollow, name="follow"),
    path("deleteFollower", views.deleteFollower),
    path("follow", views.follow),
    path("followers/follow", views.follow),
    path("followings/follow", views.follow),
    path("feeds/<int:user_id>/<str:showStatus>", views.showFeeds),
]
